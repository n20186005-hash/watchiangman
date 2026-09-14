var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e2) {
    throw err = [e2], e2;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// dist/_worker.js/chunks/astro/server_CG2QLMoV.mjs
function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n2 = -2; n2 <= 2; n2++) {
    if (lines[loc.line + n2]) visibleLines.push(loc.line + n2);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth) gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}
function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = /* @__PURE__ */ __name((...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  }, "fn");
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}
function createAstroGlobFn() {
  const globHandler = /* @__PURE__ */ __name((importMetaGlobResult) => {
    console.warn(`Astro.glob is deprecated and will be removed in a future major version of Astro.
Use import.meta.glob instead: https://vitejs.dev/guide/features.html#glob-import`);
    if (typeof importMetaGlobResult === "string") {
      throw new AstroError({
        ...AstroGlobUsedOutside,
        message: AstroGlobUsedOutside.message(JSON.stringify(importMetaGlobResult))
      });
    }
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new AstroError({
        ...AstroGlobNoMatch,
        message: AstroGlobNoMatch.message(JSON.stringify(importMetaGlobResult))
      });
    }
    return Promise.all(allEntries.map((fn) => fn()));
  }, "globHandler");
  return globHandler;
}
function createAstro(site) {
  return {
    site: new URL(site),
    generator: `Astro v${ASTRO_VERSION}`,
    glob: createAstroGlobFn()
  };
}
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${s.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}
function isPromise(value) {
  return !!value && typeof value === "object" && "then" in value && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
  return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
  if (hasGetReader(iterable)) {
    for await (const chunk of streamAsyncIterator(iterable)) {
      yield unescapeHTML(chunk);
    }
  } else {
    for await (const chunk of iterable) {
      yield unescapeHTML(chunk);
    }
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (str[/* @__PURE__ */ Symbol.for("astro:slot-string")]) {
      return str;
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str || hasGetReader(str)) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  const hint = getPropagationHint(result, factory);
  return hint === "in-tree" || hint === "self";
}
function getPropagationHint(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.componentMetadata.has(factory.moduleId) && hint === "none") {
    hint = result.componentMetadata.get(factory.moduleId).propagation;
  }
  return hint;
}
function r(e2) {
  var t2, f, n2 = "";
  if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
  else if ("object" == typeof e2) if (Array.isArray(e2)) {
    var o2 = e2.length;
    for (t2 = 0; t2 < o2; t2++) e2[t2] && (f = r(e2[t2])) && (n2 && (n2 += " "), n2 += f);
  } else for (f in e2) e2[f] && (n2 && (n2 += " "), n2 += f);
  return n2;
}
function clsx() {
  for (var e2, t2, f = 0, n2 = "", o2 = arguments.length; f < o2; f++) (e2 = arguments[f]) && (t2 = r(e2)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Infinity) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === -Infinity) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i2 = 0; i2 < str.length; i2++) {
    const ch = str.charCodeAt(i2);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
function isHeadAndContent(obj) {
  return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function createThinHead() {
  return {
    [headAndContentSym]: true
  };
}
function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirectives = result.clientDirectives;
  const clientDirective = clientDirectives.get(directive);
  if (!clientDirective) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `<style>${ISLAND_STYLES}</style><script>${getDirectiveScriptText(result, directive)}<\/script><script>${astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}<\/script>`;
  }
}
function renderCspContent(result) {
  const finalScriptHashes = /* @__PURE__ */ new Set();
  const finalStyleHashes = /* @__PURE__ */ new Set();
  for (const scriptHash of result.scriptHashes) {
    finalScriptHashes.add(`'${scriptHash}'`);
  }
  for (const styleHash of result.styleHashes) {
    finalStyleHashes.add(`'${styleHash}'`);
  }
  for (const styleHash of result._metadata.extraStyleHashes) {
    finalStyleHashes.add(`'${styleHash}'`);
  }
  for (const scriptHash of result._metadata.extraScriptHashes) {
    finalScriptHashes.add(`'${scriptHash}'`);
  }
  let directives;
  if (result.directives.length > 0) {
    directives = result.directives.join(";") + ";";
  }
  let scriptResources = "'self'";
  if (result.scriptResources.length > 0) {
    scriptResources = result.scriptResources.map((r2) => `${r2}`).join(" ");
  }
  let styleResources = "'self'";
  if (result.styleResources.length > 0) {
    styleResources = result.styleResources.map((r2) => `${r2}`).join(" ");
  }
  const strictDynamic = result.isStrictDynamic ? ` 'strict-dynamic'` : "";
  const scriptSrc = `script-src ${scriptResources} ${Array.from(finalScriptHashes).join(" ")}${strictDynamic};`;
  const styleSrc = `style-src ${styleResources} ${Array.from(finalStyleHashes).join(" ")};`;
  return [directives, scriptSrc, styleSrc].filter(Boolean).join(" ");
}
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)?.replace(
      /<\/script>/g,
      "\\x3C/script>"
    )};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function isCustomElement(tagName) {
  return tagName.includes("-");
}
function handleBooleanAttribute(key, value, shouldEscape, tagName) {
  if (tagName && isCustomElement(tagName)) {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
  return markHTMLString(value ? ` ${key}` : "");
}
function addAttribute(value, key, shouldEscape = true, tagName = "") {
  if (value == null) {
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(clsx(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString)) {
    if (Array.isArray(value) && value.length === 2) {
      return markHTMLString(
        ` ${key}="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`
      );
    }
    if (typeof value === "object") {
      return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
    }
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (typeof value === "string" && value.includes("&") && isHttpUrl(value)) {
    return markHTMLString(` ${key}="${toAttributeString(value, false)}"`);
  }
  if (htmlBooleanAttributes.test(key)) {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (value === "") {
    return markHTMLString(` ${key}`);
  }
  if (key === "popover" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (key === "download" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function internalSpreadAttributes(values, shouldEscape = true, tagName) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape, tagName);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>${children}</${name}>`;
}
function createBufferedRenderer(destination, renderFunction) {
  return new BufferedRenderer(destination, renderFunction);
}
function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
function isHttpUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return VALID_PROTOCOLS.includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  let content = "";
  if (result.shouldInjectCspMetaTags && result.cspDestination === "meta") {
    content += renderElement$1(
      "meta",
      {
        props: {
          "http-equiv": "content-security-policy",
          content: renderCspContent(result)
        },
        children: ""
      },
      false
    );
  }
  const styles = Array.from(result.styles).filter(uniqueElements).map(
    (style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style)
  );
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script) => {
    if (result.userAssetsBase) {
      script.props.src = (result.base === "/" ? "" : result.base) + result.userAssetsBase + script.props.src;
    }
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  content += styles.join("\n") + links.join("\n") + scripts.join("\n");
  if (result._metadata.extraHead.length > 0) {
    for (const part of result._metadata.extraHead) {
      content += part;
    }
  }
  return markHTMLString(content);
}
function maybeRenderHead() {
  return createRenderInstruction({ type: "maybe-head" });
}
function encodeHexUpperCase(data) {
  let result = "";
  for (let i2 = 0; i2 < data.length; i2++) {
    result += alphabetUpperCase[data[i2] >> 4];
    result += alphabetUpperCase[data[i2] & 15];
  }
  return result;
}
function decodeHex(data) {
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const result = new Uint8Array(data.length / 2);
  for (let i2 = 0; i2 < data.length; i2 += 2) {
    if (!(data[i2] in decodeMap)) {
      throw new Error("Invalid character");
    }
    if (!(data[i2 + 1] in decodeMap)) {
      throw new Error("Invalid character");
    }
    result[i2 / 2] |= decodeMap[data[i2]] << 4;
    result[i2 / 2] |= decodeMap[data[i2 + 1]];
  }
  return result;
}
function encodeBase64(bytes) {
  return encodeBase64_internal(bytes, base64Alphabet, EncodingPadding.Include);
}
function encodeBase64_internal(bytes, alphabet, padding) {
  let result = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2 += 3) {
    let buffer2 = 0;
    let bufferBitSize = 0;
    for (let j = 0; j < 3 && i2 + j < bytes.byteLength; j++) {
      buffer2 = buffer2 << 8 | bytes[i2 + j];
      bufferBitSize += 8;
    }
    for (let j = 0; j < 4; j++) {
      if (bufferBitSize >= 6) {
        result += alphabet[buffer2 >> bufferBitSize - 6 & 63];
        bufferBitSize -= 6;
      } else if (bufferBitSize > 0) {
        result += alphabet[buffer2 << 6 - bufferBitSize & 63];
        bufferBitSize = 0;
      } else if (padding === EncodingPadding.Include) {
        result += "=";
      }
    }
  }
  return result;
}
function decodeBase64(encoded) {
  return decodeBase64_internal(encoded, base64DecodeMap, DecodingPadding.Required);
}
function decodeBase64_internal(encoded, decodeMap2, padding) {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i2 = 0; i2 < encoded.length; i2 += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j = 0; j < 4; j++) {
      if (padding === DecodingPadding.Required && encoded[i2 + j] === "=") {
        continue;
      }
      if (padding === DecodingPadding.Ignore && (i2 + j >= encoded.length || encoded[i2 + j] === "=")) {
        continue;
      }
      if (j > 0 && encoded[i2 + j - 1] === "=") {
        throw new Error("Invalid padding");
      }
      if (!(encoded[i2 + j] in decodeMap2)) {
        throw new Error("Invalid character");
      }
      chunk |= decodeMap2[encoded[i2 + j]] << (3 - j) * 6;
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused;
      if (bitsRead === 12) {
        unused = chunk & 65535;
      } else if (bitsRead === 18) {
        unused = chunk & 255;
      } else {
        throw new Error("Invalid padding");
      }
      if (unused !== 0) {
        throw new Error("Invalid padding");
      }
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i3 = 0; i3 < byteLength; i3++) {
      result[totalBytes] = chunk >> 16 - i3 * 8 & 255;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}
function getErrorMap() {
  return overrideErrorMap;
}
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header2] = jwt.split(".");
    if (!header2)
      return false;
    const base64 = header2.replace(/-/g, "+").replace(/_/g, "/").padEnd(header2.length + (4 - header2.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
function mergeValues(a2, b) {
  const aType = getParsedType(a2);
  const bType = getParsedType(b);
  if (a2 === b) {
    return { valid: true, data: a2 };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a2).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a2, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a2[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a2.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a2.length; index++) {
      const itemA = a2[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a2 === +b) {
    return { valid: true, data: a2 };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r2 = check(data);
      if (r2 instanceof Promise) {
        return r2.then((r3) => {
          if (!r3) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r2) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
async function decodeKey(encoded) {
  const bytes = decodeBase64(encoded);
  return crypto.subtle.importKey("raw", bytes.buffer, ALGORITHM, true, [
    "encrypt",
    "decrypt"
  ]);
}
async function encryptString(key, raw) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const data = encoder$1.encode(raw);
  const buffer2 = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    data
  );
  return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer2));
}
async function decryptString(key, encoded) {
  const iv = decodeHex(encoded.slice(0, IV_LENGTH));
  const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    dataArray
  );
  const decryptedString = decoder$1.decode(decryptedBuffer);
  return decryptedString;
}
async function generateCspDigest(data, algorithm) {
  const hashBuffer = await crypto.subtle.digest(algorithm, encoder$1.encode(data));
  const hash = encodeBase64(new Uint8Array(hashBuffer));
  return `${ALGORITHMS[algorithm]}${hash}`;
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}
function isSlotString(str) {
  return !!str[slotString];
}
function mergeSlotInstructions(target, source) {
  if (source.instructions?.length) {
    target ??= [];
    target.push(...source.instructions);
  }
  return target;
}
function renderSlot(result, slotted, fallback) {
  if (!slotted && fallback) {
    return renderSlot(result, fallback);
  }
  return {
    async render(destination) {
      await renderChild(destination, typeof slotted === "function" ? slotted(result) : slotted);
    }
  };
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const temporaryDestination = {
    write(chunk) {
      if (chunk instanceof SlotString) {
        content += chunk;
        instructions = mergeSlotInstructions(instructions, chunk);
      } else if (chunk instanceof Response) return;
      else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunkToString(result, chunk);
      }
    }
  };
  const renderInstance = renderSlot(result, slotted, fallback);
  await renderInstance.render(temporaryDestination);
  return markHTMLString(new SlotString(content, instructions));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlotToString(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}
function createSlotValueFromString(content) {
  return function() {
    return renderTemplate`${unescapeHTML(content)}`;
  };
}
function containsServerDirective(props) {
  return "server:component-directive" in props;
}
function safeJsonStringify(obj) {
  return JSON.stringify(obj).replace(SCRIPT_RE, SCRIPT_REPLACER).replace(COMMENT_RE, COMMENT_REPLACER);
}
function createSearchParams(encryptedComponentExport, encryptedProps, slots) {
  const params = new URLSearchParams();
  params.set("e", encryptedComponentExport);
  params.set("p", encryptedProps);
  params.set("s", slots);
  return params;
}
function isWithinURLLimit(pathname, params) {
  const url = pathname + "?" + params.toString();
  const chars = url.length;
  return chars < 2048;
}
function stringifyChunk(result, chunk) {
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        if (needsHydrationScript) {
          let prescripts = getPrescripts(result, "both", hydration.directive);
          return markHTMLString(prescripts);
        } else if (needsDirectiveScript) {
          let prescripts = getPrescripts(result, "directive", hydration.directive);
          return markHTMLString(prescripts);
        } else {
          return "";
        }
      }
      case "head": {
        if (result._metadata.hasRenderedHead || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "maybe-head": {
        if (result._metadata.hasRenderedHead || result._metadata.headInTree || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      case "server-island-runtime": {
        if (result._metadata.hasRenderedServerIslandRuntime) {
          return "";
        }
        result._metadata.hasRenderedServerIslandRuntime = true;
        return renderServerIslandRuntime();
      }
      case "script": {
        const { id, content } = instruction;
        if (result._metadata.renderedScripts.has(id)) {
          return "";
        }
        result._metadata.renderedScripts.add(id);
        return content;
      }
      default: {
        throw new Error(`Unknown chunk type: ${chunk.type}`);
      }
    }
  } else if (chunk instanceof Response) {
    return "";
  } else if (isSlotString(chunk)) {
    let out = "";
    const c = chunk;
    if (c.instructions) {
      for (const instr of c.instructions) {
        out += stringifyChunk(result, instr);
      }
    }
    out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return decoder.decode(chunk);
  } else {
    return stringifyChunk(result, chunk);
  }
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    const stringified = stringifyChunk(result, chunk);
    return encoder.encode(stringified.toString());
  }
}
function chunkToByteArrayOrString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    return stringifyChunk(result, chunk).toString();
  }
}
function isRenderInstance(obj) {
  return !!obj && typeof obj === "object" && "render" in obj && typeof obj.render === "function";
}
function renderChild(destination, child) {
  if (isPromise(child)) {
    return child.then((x) => renderChild(destination, x));
  }
  if (child instanceof SlotString) {
    destination.write(child);
    return;
  }
  if (isHTMLString(child)) {
    destination.write(child);
    return;
  }
  if (Array.isArray(child)) {
    return renderArray(destination, child);
  }
  if (typeof child === "function") {
    return renderChild(destination, child());
  }
  if (!child && child !== 0) {
    return;
  }
  if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
    return;
  }
  if (isRenderInstance(child)) {
    return child.render(destination);
  }
  if (isRenderTemplateResult(child)) {
    return child.render(destination);
  }
  if (isAstroComponentInstance(child)) {
    return child.render(destination);
  }
  if (ArrayBuffer.isView(child)) {
    destination.write(child);
    return;
  }
  if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    if (Symbol.asyncIterator in child) {
      return renderAsyncIterable(destination, child);
    }
    return renderIterable(destination, child);
  }
  destination.write(child);
}
function renderArray(destination, children) {
  const flushers = children.map((c) => {
    return createBufferedRenderer(destination, (bufferDestination) => {
      return renderChild(bufferDestination, c);
    });
  });
  const iterator = flushers[Symbol.iterator]();
  const iterate = /* @__PURE__ */ __name(() => {
    for (; ; ) {
      const { value: flusher, done } = iterator.next();
      if (done) {
        break;
      }
      const result = flusher.flush();
      if (isPromise(result)) {
        return result.then(iterate);
      }
    }
  }, "iterate");
  return iterate();
}
function renderIterable(destination, children) {
  const iterator = children[Symbol.iterator]();
  const iterate = /* @__PURE__ */ __name(() => {
    for (; ; ) {
      const { value, done } = iterator.next();
      if (done) {
        break;
      }
      const result = renderChild(destination, value);
      if (isPromise(result)) {
        return result.then(iterate);
      }
    }
  }, "iterate");
  return iterate();
}
async function renderAsyncIterable(destination, children) {
  for await (const value of children) {
    await renderChild(destination, value);
  }
}
function validateComponentProps(props, clientDirectives, displayName) {
  if (props != null) {
    const directives = [...clientDirectives.keys()].map((directive) => `client:${directive}`);
    for (const prop of Object.keys(props)) {
      if (directives.includes(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, result.clientDirectives, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory)) {
    result._metadata.propagators.add(instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e2) {
          if (AstroError.is(e2) && !e2.loc) {
            e2.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e2), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  const iterator = result._metadata.propagators.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    const returnValue = await value.init(result);
    if (isHeadAndContent(returnValue) && returnValue.head) {
      result._metadata.extraHead.push(returnValue.head);
    }
  }
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer2 = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer2.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i2 = 0, len = buffer2.length; i2 < len; i2++) {
        const bufferEntry = buffer2[i2];
        if (typeof bufferEntry === "string") {
          const nextIsString = i2 + 1 < len && typeof buffer2[i2 + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer2[i2] = encoded;
          } else {
            buffer2[i2] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i2 = 0, len = buffer2.length; i2 < len; i2++) {
        const item = buffer2[i2];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer2.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer2.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer2.push(bytes);
        next?.resolve();
      } else if (buffer2.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error2 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r2) => r2.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error2;
      for (const r2 of renderers2) {
        try {
          if (await r2.ssr.check.call({ result }, Component, props, children)) {
            renderer = r2;
            break;
          }
        } catch (e2) {
          error2 ??= e2;
        }
      }
      if (!renderer && error2) {
        throw error2;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r2) => "`" + r2 + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r2) => r2.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r2) => probableRendererNames.includes(r2.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r2) => "`" + r2 + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template2 = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template2}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlotToString(result, slots?.default);
  return {
    render(destination) {
      if (children == null) return;
      destination.write(children);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots).catch(handleCancellation);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e2) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e2;
  }
  __name(handleCancellation, "handleCancellation");
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e2) {
    if (AstroError.is(e2) && !e2.loc) {
      e2.setLocation({
        file: route?.component
      });
    }
    throw e2;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = /* @__PURE__ */ __name(function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      }, "extractSlots2");
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    const str = await renderComponentToString(
      result,
      componentFactory.name,
      componentFactory,
      pageProps,
      {},
      true,
      route
    );
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}
function requireCssesc() {
  if (hasRequiredCssesc) return cssesc_1;
  hasRequiredCssesc = 1;
  var object = {};
  var hasOwnProperty = object.hasOwnProperty;
  var merge = /* @__PURE__ */ __name(function merge2(options, defaults) {
    if (!options) {
      return defaults;
    }
    var result = {};
    for (var key in defaults) {
      result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
    }
    return result;
  }, "merge");
  var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
  var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
  var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
  var cssesc = /* @__PURE__ */ __name(function cssesc2(string, options) {
    options = merge(options, cssesc2.options);
    if (options.quotes != "single" && options.quotes != "double") {
      options.quotes = "single";
    }
    var quote = options.quotes == "double" ? '"' : "'";
    var isIdentifier = options.isIdentifier;
    var firstChar = string.charAt(0);
    var output = "";
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var character = string.charAt(counter++);
      var codePoint = character.charCodeAt();
      var value = void 0;
      if (codePoint < 32 || codePoint > 126) {
        if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
          var extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
          } else {
            counter--;
          }
        }
        value = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else {
        if (options.escapeEverything) {
          if (regexAnySingleEscape.test(character)) {
            value = "\\" + character;
          } else {
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
          }
        } else if (/[\t\n\f\r\x0B]/.test(character)) {
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        } else if (character == "\\" || !isIdentifier && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
          value = "\\" + character;
        } else {
          value = character;
        }
      }
      output += value;
    }
    if (isIdentifier) {
      if (/^-[-\d]/.test(output)) {
        output = "\\-" + output.slice(1);
      } else if (/\d/.test(firstChar)) {
        output = "\\3" + firstChar + " " + output.slice(1);
      }
    }
    output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
      if ($1 && $1.length % 2) {
        return $0;
      }
      return ($1 || "") + $2;
    });
    if (!isIdentifier && options.wrap) {
      return quote + output + quote;
    }
    return output;
  }, "cssesc");
  cssesc.options = {
    "escapeEverything": false,
    "isIdentifier": false,
    "quotes": "single",
    "wrap": false
  };
  cssesc.version = "3.0.0";
  cssesc_1 = cssesc;
  return cssesc_1;
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true, _name);
  }
  return markHTMLString(output);
}
var AstroError, ClientAddressNotAvailable, PrerenderClientAddressNotAvailable, StaticClientAddressNotAvailable, NoMatchingStaticPathFound, OnlyResponseCanBeReturned, MissingMediaQueryDirective, NoMatchingRenderer, NoClientOnlyHint, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, GetStaticPathsExpectedParams, GetStaticPathsInvalidRouteParam, GetStaticPathsRequired, ReservedSlotName, NoMatchingImport, InvalidComponentArgs, PageNumberParamNotFound, PrerenderDynamicEndpointPathCollide, ResponseSentError, MiddlewareNoDataOrNextCalled, MiddlewareNotAResponse, EndpointDidNotReturnAResponse, LocalsNotAnObject, LocalsReassigned, AstroResponseHeadersReassigned, AstroGlobUsedOutside, AstroGlobNoMatch, FailedToFindPageMapSSR, i18nNoLocaleFoundInPath, RewriteWithBodyUsed, ForbiddenRewrite, CspNotEnabled, ActionsReturnedInvalidDataError, ActionNotFoundError, SessionStorageInitError, SessionStorageSaveError, ASTRO_VERSION, REROUTE_DIRECTIVE_HEADER, REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE, NOOP_MIDDLEWARE_HEADER, ROUTE_TYPE_HEADER, DEFAULT_404_COMPONENT, REDIRECT_STATUS_CODES, REROUTABLE_STATUS_CODES, clientAddressSymbol, originPathnameSymbol, responseSentSymbol, e, t, n, r$1, i, a, o, s, replace, ca, esca, pe, escape, escapeHTML, HTMLBytes, HTMLString, markHTMLString, AstroJSX, PROP_TYPE, transitionDirectivesToCopyOnIsland, dictionary, binary, headAndContentSym, astro_island_prebuilt_default, ISLAND_STYLES, RenderInstructionSymbol, voidElementNames, htmlBooleanAttributes, AMPERSAND_REGEX, DOUBLE_QUOTE_REGEX, STATIC_DIRECTIVES, toIdent, toAttributeString, kebab, toStyleString, noop, BufferedRenderer, isNode, isDeno, VALID_PROTOCOLS, uniqueElements, alphabetUpperCase, decodeMap, EncodingPadding$1, DecodingPadding$1, base64Alphabet, EncodingPadding, DecodingPadding, base64DecodeMap, util, objectUtil, ZodParsedType, getParsedType, ZodIssueCode, ZodError, errorMap, overrideErrorMap, makeIssue, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync, errorUtil, ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, ZodIntersection, ZodTuple, ZodMap, ZodSet, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, ZodBranded, ZodPipeline, ZodReadonly, ZodFirstPartyTypeKind, enumType, ALGORITHMS, ALGORITHM_VALUES, ALLOWED_DIRECTIVES, ALGORITHM, encoder$1, decoder$1, IV_LENGTH, renderTemplateResultSym, RenderTemplateResult, slotString, SlotString, internalProps, SCRIPT_RE, COMMENT_RE, SCRIPT_REPLACER, COMMENT_REPLACER, ServerIslandComponent, renderServerIslandRuntime, SERVER_ISLAND_REPLACER, Fragment, Renderer, encoder, decoder, astroComponentInstanceSym, AstroComponentInstance, DOCTYPE_EXP, needsHeadRenderingSymbol, rendererAliases, clientOnlyValues, ASTRO_SLOT_EXP, ASTRO_STATIC_SLOT_EXP, ClientOnlyPlaceholder, hasTriedRenderComponentSymbol, cssesc_1, hasRequiredCssesc;
var init_server_CG2QLMoV = __esm({
  "dist/_worker.js/chunks/astro/server_CG2QLMoV.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(normalizeLF, "normalizeLF");
    __name(codeFrame, "codeFrame");
    AstroError = class extends Error {
      static {
        __name(this, "AstroError");
      }
      loc;
      title;
      hint;
      frame;
      type = "AstroError";
      constructor(props, options) {
        const { name, title, message, stack, location, hint, frame } = props;
        super(message, options);
        this.title = title;
        this.name = name;
        if (message) this.message = message;
        this.stack = stack ? stack : this.stack;
        this.loc = location;
        this.hint = hint;
        this.frame = frame;
      }
      setLocation(location) {
        this.loc = location;
      }
      setName(name) {
        this.name = name;
      }
      setMessage(message) {
        this.message = message;
      }
      setHint(hint) {
        this.hint = hint;
      }
      setFrame(source, location) {
        this.frame = codeFrame(source, location);
      }
      static is(err) {
        return err?.type === "AstroError";
      }
    };
    ClientAddressNotAvailable = {
      name: "ClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in current adapter.",
      message: /* @__PURE__ */ __name((adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`, "message")
    };
    PrerenderClientAddressNotAvailable = {
      name: "PrerenderClientAddressNotAvailable",
      title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
      message: /* @__PURE__ */ __name((name) => `\`Astro.clientAddress\` cannot be used inside prerendered route ${name}`, "message")
    };
    StaticClientAddressNotAvailable = {
      name: "StaticClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in prerendered pages.",
      message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
    };
    NoMatchingStaticPathFound = {
      name: "NoMatchingStaticPathFound",
      title: "No static path found for requested path.",
      message: /* @__PURE__ */ __name((pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`, "message"),
      hint: /* @__PURE__ */ __name((possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`, "hint")
    };
    OnlyResponseCanBeReturned = {
      name: "OnlyResponseCanBeReturned",
      title: "Invalid type returned by Astro page.",
      message: /* @__PURE__ */ __name((route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`, "message"),
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
    };
    MissingMediaQueryDirective = {
      name: "MissingMediaQueryDirective",
      title: "Missing value for `client:media` directive.",
      message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
    };
    NoMatchingRenderer = {
      name: "NoMatchingRenderer",
      title: "No matching renderer found.",
      message: /* @__PURE__ */ __name((componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`, "message"),
      hint: /* @__PURE__ */ __name((probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`, "hint")
    };
    NoClientOnlyHint = {
      name: "NoClientOnlyHint",
      title: "Missing hint on client:only directive.",
      message: /* @__PURE__ */ __name((componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`, "message"),
      hint: /* @__PURE__ */ __name((probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`, "hint")
    };
    InvalidGetStaticPathsEntry = {
      name: "InvalidGetStaticPathsEntry",
      title: "Invalid entry inside getStaticPath's return value",
      message: /* @__PURE__ */ __name((entryType) => `Invalid entry returned by getStaticPaths. Expected an object, got \`${entryType}\``, "message"),
      hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    InvalidGetStaticPathsReturn = {
      name: "InvalidGetStaticPathsReturn",
      title: "Invalid value returned by getStaticPaths.",
      message: /* @__PURE__ */ __name((returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``, "message"),
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsExpectedParams = {
      name: "GetStaticPathsExpectedParams",
      title: "Missing params property on `getStaticPaths` route.",
      message: "Missing or empty required `params` property on `getStaticPaths` route.",
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsInvalidRouteParam = {
      name: "GetStaticPathsInvalidRouteParam",
      title: "Invalid value for `getStaticPaths` route parameter.",
      message: /* @__PURE__ */ __name((key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`, "message"),
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsRequired = {
      name: "GetStaticPathsRequired",
      title: "`getStaticPaths()` function required for dynamic routes.",
      message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
      hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
    };
    ReservedSlotName = {
      name: "ReservedSlotName",
      title: "Invalid slot name.",
      message: /* @__PURE__ */ __name((slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`, "message")
    };
    NoMatchingImport = {
      name: "NoMatchingImport",
      title: "No import found for component.",
      message: /* @__PURE__ */ __name((componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`, "message"),
      hint: "Please make sure the component is properly imported."
    };
    InvalidComponentArgs = {
      name: "InvalidComponentArgs",
      title: "Invalid component arguments.",
      message: /* @__PURE__ */ __name((name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`, "message"),
      hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
    };
    PageNumberParamNotFound = {
      name: "PageNumberParamNotFound",
      title: "Page number param not found.",
      message: /* @__PURE__ */ __name((paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`, "message"),
      hint: "Rename your file to `[page].astro` or `[...page].astro`."
    };
    PrerenderDynamicEndpointPathCollide = {
      name: "PrerenderDynamicEndpointPathCollide",
      title: "Prerendered dynamic endpoint has path collision.",
      message: /* @__PURE__ */ __name((pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`, "message"),
      hint: /* @__PURE__ */ __name((filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m) => `.json` + m)}\``, "hint")
    };
    ResponseSentError = {
      name: "ResponseSentError",
      title: "Unable to set response.",
      message: "The response has already been sent to the browser and cannot be altered."
    };
    MiddlewareNoDataOrNextCalled = {
      name: "MiddlewareNoDataOrNextCalled",
      title: "The middleware didn't return a `Response`.",
      message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
    };
    MiddlewareNotAResponse = {
      name: "MiddlewareNotAResponse",
      title: "The middleware returned something that is not a `Response` object.",
      message: "Any data returned from middleware must be a valid `Response` object."
    };
    EndpointDidNotReturnAResponse = {
      name: "EndpointDidNotReturnAResponse",
      title: "The endpoint did not return a `Response`.",
      message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
    };
    LocalsNotAnObject = {
      name: "LocalsNotAnObject",
      title: "Value assigned to `locals` is not accepted.",
      message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
      hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
    };
    LocalsReassigned = {
      name: "LocalsReassigned",
      title: "`locals` must not be reassigned.",
      message: "`locals` can not be assigned directly.",
      hint: "Set a `locals` property instead."
    };
    AstroResponseHeadersReassigned = {
      name: "AstroResponseHeadersReassigned",
      title: "`Astro.response.headers` must not be reassigned.",
      message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
      hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
    };
    AstroGlobUsedOutside = {
      name: "AstroGlobUsedOutside",
      title: "Astro.glob() used outside of an Astro file.",
      message: /* @__PURE__ */ __name((globStr) => `\`Astro.glob(${globStr})\` can only be used in \`.astro\` files. \`import.meta.glob(${globStr})\` can be used instead to achieve a similar result.`, "message"),
      hint: "See Vite's documentation on `import.meta.glob` for more information: https://vite.dev/guide/features.html#glob-import"
    };
    AstroGlobNoMatch = {
      name: "AstroGlobNoMatch",
      title: "Astro.glob() did not match any files.",
      message: /* @__PURE__ */ __name((globStr) => `\`Astro.glob(${globStr})\` did not return any matching files.`, "message"),
      hint: "Check the pattern for typos."
    };
    FailedToFindPageMapSSR = {
      name: "FailedToFindPageMapSSR",
      title: "Astro couldn't find the correct page to render",
      message: "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error. Please file an issue."
    };
    i18nNoLocaleFoundInPath = {
      name: "i18nNoLocaleFoundInPath",
      title: "The path doesn't contain any locale",
      message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
    };
    RewriteWithBodyUsed = {
      name: "RewriteWithBodyUsed",
      title: "Cannot use Astro.rewrite after the request body has been read",
      message: "Astro.rewrite() cannot be used if the request body has already been read. If you need to read the body, first clone the request."
    };
    ForbiddenRewrite = {
      name: "ForbiddenRewrite",
      title: "Forbidden rewrite to a static route.",
      message: /* @__PURE__ */ __name((from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`, "message"),
      hint: /* @__PURE__ */ __name((component) => `Add \`export const prerender = false\` to the component '${component}', or use a Astro.redirect().`, "hint")
    };
    CspNotEnabled = {
      name: "CspNotEnabled",
      title: "CSP feature isn't enabled",
      message: "The `experimental.csp` configuration isn't enabled."
    };
    ActionsReturnedInvalidDataError = {
      name: "ActionsReturnedInvalidDataError",
      title: "Action handler returned invalid data.",
      message: /* @__PURE__ */ __name((error2) => `Action handler returned invalid data. Handlers should return serializable data types like objects, arrays, strings, and numbers. Parse error: ${error2}`, "message"),
      hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
    };
    ActionNotFoundError = {
      name: "ActionNotFoundError",
      title: "Action not found.",
      message: /* @__PURE__ */ __name((actionName) => `The server received a request for an action named \`${actionName}\` but could not find a match. If you renamed an action, check that you've updated your \`actions/index\` file and your calling code to match.`, "message"),
      hint: "You can run `astro check` to detect type errors caused by mismatched action names."
    };
    SessionStorageInitError = {
      name: "SessionStorageInitError",
      title: "Session storage could not be initialized.",
      message: /* @__PURE__ */ __name((error2, driver) => `Error when initializing session storage${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``, "message"),
      hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
    };
    SessionStorageSaveError = {
      name: "SessionStorageSaveError",
      title: "Session data could not be saved.",
      message: /* @__PURE__ */ __name((error2, driver) => `Error when saving session data${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``, "message"),
      hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
    };
    __name(validateArgs, "validateArgs");
    __name(baseCreateComponent, "baseCreateComponent");
    __name(createComponentWithOptions, "createComponentWithOptions");
    __name(createComponent, "createComponent");
    ASTRO_VERSION = "5.18.2";
    REROUTE_DIRECTIVE_HEADER = "X-Astro-Reroute";
    REWRITE_DIRECTIVE_HEADER_KEY = "X-Astro-Rewrite";
    REWRITE_DIRECTIVE_HEADER_VALUE = "yes";
    NOOP_MIDDLEWARE_HEADER = "X-Astro-Noop";
    ROUTE_TYPE_HEADER = "X-Astro-Route-Type";
    DEFAULT_404_COMPONENT = "astro-default-404.astro";
    REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308, 300, 304];
    REROUTABLE_STATUS_CODES = [404, 500];
    clientAddressSymbol = /* @__PURE__ */ Symbol.for("astro.clientAddress");
    originPathnameSymbol = /* @__PURE__ */ Symbol.for("astro.originPathname");
    responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
    __name(createAstroGlobFn, "createAstroGlobFn");
    __name(createAstro, "createAstro");
    e = globalThis.process || {};
    t = e.argv || [];
    n = e.env || {};
    r$1 = !(n.NO_COLOR || t.includes(`--no-color`)) && (!!n.FORCE_COLOR || t.includes(`--color`) || e.platform === `win32` || (e.stdout || {}).isTTY && n.TERM !== `dumb` || !!n.CI);
    i = /* @__PURE__ */ __name((e2, t2, n2 = e2) => (r2) => {
      let i2 = `` + r2, o2 = i2.indexOf(t2, e2.length);
      return ~o2 ? e2 + a(i2, t2, n2, o2) + t2 : e2 + i2 + t2;
    }, "i");
    a = /* @__PURE__ */ __name((e2, t2, n2, r2) => {
      let i2 = ``, a2 = 0;
      do
        i2 += e2.substring(a2, r2) + n2, a2 = r2 + t2.length, r2 = e2.indexOf(t2, a2);
      while (~r2);
      return i2 + e2.substring(a2);
    }, "a");
    o = /* @__PURE__ */ __name((e2 = r$1) => {
      let t2 = e2 ? i : () => String;
      return { isColorSupported: e2, reset: t2(`\x1B[0m`, `\x1B[0m`), bold: t2(`\x1B[1m`, `\x1B[22m`, `\x1B[22m\x1B[1m`), dim: t2(`\x1B[2m`, `\x1B[22m`, `\x1B[22m\x1B[2m`), italic: t2(`\x1B[3m`, `\x1B[23m`), underline: t2(`\x1B[4m`, `\x1B[24m`), inverse: t2(`\x1B[7m`, `\x1B[27m`), hidden: t2(`\x1B[8m`, `\x1B[28m`), strikethrough: t2(`\x1B[9m`, `\x1B[29m`), black: t2(`\x1B[30m`, `\x1B[39m`), red: t2(`\x1B[31m`, `\x1B[39m`), green: t2(`\x1B[32m`, `\x1B[39m`), yellow: t2(`\x1B[33m`, `\x1B[39m`), blue: t2(`\x1B[34m`, `\x1B[39m`), magenta: t2(`\x1B[35m`, `\x1B[39m`), cyan: t2(`\x1B[36m`, `\x1B[39m`), white: t2(`\x1B[37m`, `\x1B[39m`), gray: t2(`\x1B[90m`, `\x1B[39m`), bgBlack: t2(`\x1B[40m`, `\x1B[49m`), bgRed: t2(`\x1B[41m`, `\x1B[49m`), bgGreen: t2(`\x1B[42m`, `\x1B[49m`), bgYellow: t2(`\x1B[43m`, `\x1B[49m`), bgBlue: t2(`\x1B[44m`, `\x1B[49m`), bgMagenta: t2(`\x1B[45m`, `\x1B[49m`), bgCyan: t2(`\x1B[46m`, `\x1B[49m`), bgWhite: t2(`\x1B[47m`, `\x1B[49m`), blackBright: t2(`\x1B[90m`, `\x1B[39m`), redBright: t2(`\x1B[91m`, `\x1B[39m`), greenBright: t2(`\x1B[92m`, `\x1B[39m`), yellowBright: t2(`\x1B[93m`, `\x1B[39m`), blueBright: t2(`\x1B[94m`, `\x1B[39m`), magentaBright: t2(`\x1B[95m`, `\x1B[39m`), cyanBright: t2(`\x1B[96m`, `\x1B[39m`), whiteBright: t2(`\x1B[97m`, `\x1B[39m`), bgBlackBright: t2(`\x1B[100m`, `\x1B[49m`), bgRedBright: t2(`\x1B[101m`, `\x1B[49m`), bgGreenBright: t2(`\x1B[102m`, `\x1B[49m`), bgYellowBright: t2(`\x1B[103m`, `\x1B[49m`), bgBlueBright: t2(`\x1B[104m`, `\x1B[49m`), bgMagentaBright: t2(`\x1B[105m`, `\x1B[49m`), bgCyanBright: t2(`\x1B[106m`, `\x1B[49m`), bgWhiteBright: t2(`\x1B[107m`, `\x1B[49m`) };
    }, "o");
    s = o();
    __name(renderEndpoint, "renderEndpoint");
    ({ replace } = "");
    ca = /[&<>'"]/g;
    esca = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    pe = /* @__PURE__ */ __name((m) => esca[m], "pe");
    escape = /* @__PURE__ */ __name((es) => replace.call(es, ca, pe), "escape");
    __name(isPromise, "isPromise");
    __name(streamAsyncIterator, "streamAsyncIterator");
    escapeHTML = escape;
    HTMLBytes = class extends Uint8Array {
      static {
        __name(this, "HTMLBytes");
      }
    };
    Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
      get() {
        return "HTMLBytes";
      }
    });
    HTMLString = class extends String {
      static {
        __name(this, "HTMLString");
      }
      get [Symbol.toStringTag]() {
        return "HTMLString";
      }
    };
    markHTMLString = /* @__PURE__ */ __name((value) => {
      if (value instanceof HTMLString) {
        return value;
      }
      if (typeof value === "string") {
        return new HTMLString(value);
      }
      return value;
    }, "markHTMLString");
    __name(isHTMLString, "isHTMLString");
    __name(markHTMLBytes, "markHTMLBytes");
    __name(hasGetReader, "hasGetReader");
    __name(unescapeChunksAsync, "unescapeChunksAsync");
    __name(unescapeChunks, "unescapeChunks");
    __name(unescapeHTML, "unescapeHTML");
    AstroJSX = "astro:jsx";
    __name(isVNode, "isVNode");
    __name(isAstroComponentFactory, "isAstroComponentFactory");
    __name(isAPropagatingComponent, "isAPropagatingComponent");
    __name(getPropagationHint, "getPropagationHint");
    __name(r, "r");
    __name(clsx, "clsx");
    PROP_TYPE = {
      Value: 0,
      JSON: 1,
      // Actually means Array
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10,
      Infinity: 11
    };
    __name(serializeArray, "serializeArray");
    __name(serializeObject, "serializeObject");
    __name(convertToSerializedForm, "convertToSerializedForm");
    __name(serializeProps, "serializeProps");
    transitionDirectivesToCopyOnIsland = Object.freeze([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props"
    ]);
    __name(extractDirectives, "extractDirectives");
    __name(generateHydrateScript, "generateHydrateScript");
    dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
    binary = dictionary.length;
    __name(bitwise, "bitwise");
    __name(shorthash, "shorthash");
    headAndContentSym = /* @__PURE__ */ Symbol.for("astro.headAndContent");
    __name(isHeadAndContent, "isHeadAndContent");
    __name(createThinHead, "createThinHead");
    astro_island_prebuilt_default = `(()=>{var A=Object.defineProperty;var g=(i,o,a)=>o in i?A(i,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[o]=a;var d=(i,o,a)=>g(i,typeof o!="symbol"?o+"":o,a);{let i={0:t=>m(t),1:t=>a(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(a(t)),5:t=>new Set(a(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>1/0*t},o=t=>{let[l,e]=t;return l in i?i[l](e):void 0},a=t=>t.map(o),m=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([l,e])=>[l,o(e)]));class y extends HTMLElement{constructor(){super(...arguments);d(this,"Component");d(this,"hydrator");d(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let c=this.querySelectorAll("astro-slot"),n={},h=this.querySelectorAll("template[data-astro-template]");for(let r of h){let s=r.closest(this.tagName);s!=null&&s.isSameNode(this)&&(n[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(let r of c){let s=r.closest(this.tagName);s!=null&&s.isSameNode(this)&&(n[r.getAttribute("name")||"default"]=r.innerHTML)}let p;try{p=this.hasAttribute("props")?m(JSON.parse(this.getAttribute("props"))):{}}catch(r){let s=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(s+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${s}\`,this.getAttribute("props"),r),r}let u;await this.hydrator(this)(this.Component,p,n,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});d(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),c.disconnect(),this.childrenConnectedCallback()},c=new MutationObserver(()=>{var n;((n=this.lastChild)==null?void 0:n.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});c.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}async start(){let e=JSON.parse(this.getAttribute("opts")),c=this.getAttribute("client");if(Astro[c]===void 0){window.addEventListener(\`astro:\${c}\`,()=>this.start(),{once:!0});return}try{await Astro[c](async()=>{let n=this.getAttribute("renderer-url"),[h,{default:p}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),u=this.getAttribute("component-export")||"default";if(!u.includes("."))this.Component=h[u];else{this.Component=h;for(let f of u.split("."))this.Component=this.Component[f]}return this.hydrator=p,this.hydrate},e,this)}catch(n){console.error(\`[astro-island] Error hydrating \${this.getAttribute("component-url")}\`,n)}}attributeChangedCallback(){this.hydrate()}}d(y,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",y)}})();`;
    ISLAND_STYLES = "astro-island,astro-slot,astro-static-slot{display:contents}";
    __name(determineIfNeedsHydrationScript, "determineIfNeedsHydrationScript");
    __name(determinesIfNeedsDirectiveScript, "determinesIfNeedsDirectiveScript");
    __name(getDirectiveScriptText, "getDirectiveScriptText");
    __name(getPrescripts, "getPrescripts");
    __name(renderCspContent, "renderCspContent");
    RenderInstructionSymbol = /* @__PURE__ */ Symbol.for("astro:render");
    __name(createRenderInstruction, "createRenderInstruction");
    __name(isRenderInstruction, "isRenderInstruction");
    voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|inert|loop|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
    AMPERSAND_REGEX = /&/g;
    DOUBLE_QUOTE_REGEX = /"/g;
    STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
    toIdent = /* @__PURE__ */ __name((k) => k.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
      if (/\W/.test(match)) return "";
      return index === 0 ? match : match.toUpperCase();
    }), "toIdent");
    toAttributeString = /* @__PURE__ */ __name((value, shouldEscape = true) => shouldEscape ? String(value).replace(AMPERSAND_REGEX, "&#38;").replace(DOUBLE_QUOTE_REGEX, "&#34;") : value, "toAttributeString");
    kebab = /* @__PURE__ */ __name((k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`), "kebab");
    toStyleString = /* @__PURE__ */ __name((obj) => Object.entries(obj).filter(([_, v]) => typeof v === "string" && v.trim() || typeof v === "number").map(([k, v]) => {
      if (k[0] !== "-" && k[1] !== "-") return `${kebab(k)}:${v}`;
      return `${k}:${v}`;
    }).join(";"), "toStyleString");
    __name(defineScriptVars, "defineScriptVars");
    __name(formatList, "formatList");
    __name(isCustomElement, "isCustomElement");
    __name(handleBooleanAttribute, "handleBooleanAttribute");
    __name(addAttribute, "addAttribute");
    __name(internalSpreadAttributes, "internalSpreadAttributes");
    __name(renderElement$1, "renderElement$1");
    noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    BufferedRenderer = class {
      static {
        __name(this, "BufferedRenderer");
      }
      chunks = [];
      renderPromise;
      destination;
      /**
       * Determines whether buffer has been flushed
       * to the final destination.
       */
      flushed = false;
      constructor(destination, renderFunction) {
        this.destination = destination;
        this.renderPromise = renderFunction(this);
        if (isPromise(this.renderPromise)) {
          Promise.resolve(this.renderPromise).catch(noop);
        }
      }
      write(chunk) {
        if (this.flushed) {
          this.destination.write(chunk);
        } else {
          this.chunks.push(chunk);
        }
      }
      flush() {
        if (this.flushed) {
          throw new Error("The render buffer has already been flushed.");
        }
        this.flushed = true;
        for (const chunk of this.chunks) {
          this.destination.write(chunk);
        }
        return this.renderPromise;
      }
    };
    __name(createBufferedRenderer, "createBufferedRenderer");
    isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
    isDeno = typeof Deno !== "undefined";
    __name(promiseWithResolvers, "promiseWithResolvers");
    VALID_PROTOCOLS = ["http:", "https:"];
    __name(isHttpUrl, "isHttpUrl");
    uniqueElements = /* @__PURE__ */ __name((item, index, all) => {
      const props = JSON.stringify(item.props);
      const children = item.children;
      return index === all.findIndex((i2) => JSON.stringify(i2.props) === props && i2.children == children);
    }, "uniqueElements");
    __name(renderAllHeadContent, "renderAllHeadContent");
    __name(maybeRenderHead, "maybeRenderHead");
    __name(encodeHexUpperCase, "encodeHexUpperCase");
    __name(decodeHex, "decodeHex");
    alphabetUpperCase = "0123456789ABCDEF";
    decodeMap = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding$1 || (EncodingPadding$1 = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding$1 || (DecodingPadding$1 = {}));
    __name(encodeBase64, "encodeBase64");
    __name(encodeBase64_internal, "encodeBase64_internal");
    base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    __name(decodeBase64, "decodeBase64");
    __name(decodeBase64_internal, "decodeBase64_internal");
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding || (EncodingPadding = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding || (DecodingPadding = {}));
    base64DecodeMap = {
      "0": 52,
      "1": 53,
      "2": 54,
      "3": 55,
      "4": 56,
      "5": 57,
      "6": 58,
      "7": 59,
      "8": 60,
      "9": 61,
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      "+": 62,
      "/": 63
    };
    (function(util2) {
      util2.assertEqual = (_) => {
      };
      function assertIs(_arg) {
      }
      __name(assertIs, "assertIs");
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      __name(assertNever, "assertNever");
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e2) {
          return obj[e2];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      __name(joinValues, "joinValues");
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = /* @__PURE__ */ __name((data) => {
      const t2 = typeof data;
      switch (t2) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    }, "getParsedType");
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    ZodError = class _ZodError extends Error {
      static {
        __name(this, "ZodError");
      }
      get errors() {
        return this.issues;
      }
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = /* @__PURE__ */ __name((error2) => {
          for (const issue of error2.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i2 = 0;
              while (i2 < issue.path.length) {
                const el = issue.path[i2];
                const terminal = i2 === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i2++;
              }
            }
          }
        }, "processError");
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            const firstEl = sub.path[0];
            fieldErrors[firstEl] = fieldErrors[firstEl] || [];
            fieldErrors[firstEl].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error2 = new ZodError(issues);
      return error2;
    };
    errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "bigint")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message };
    }, "errorMap");
    overrideErrorMap = errorMap;
    __name(getErrorMap, "getErrorMap");
    makeIssue = /* @__PURE__ */ __name((params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    }, "makeIssue");
    __name(addIssueToContext, "addIssueToContext");
    ParseStatus = class _ParseStatus {
      static {
        __name(this, "ParseStatus");
      }
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s2 of results) {
          if (s2.status === "aborted")
            return INVALID;
          if (s2.status === "dirty")
            status.dirty();
          arrayValue.push(s2.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = /* @__PURE__ */ __name((value) => ({ status: "dirty", value }), "DIRTY");
    OK = /* @__PURE__ */ __name((value) => ({ status: "valid", value }), "OK");
    isAborted = /* @__PURE__ */ __name((x) => x.status === "aborted", "isAborted");
    isDirty = /* @__PURE__ */ __name((x) => x.status === "dirty", "isDirty");
    isValid = /* @__PURE__ */ __name((x) => x.status === "valid", "isValid");
    isAsync = /* @__PURE__ */ __name((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
    })(errorUtil || (errorUtil = {}));
    ParseInputLazyPath = class {
      static {
        __name(this, "ParseInputLazyPath");
      }
      constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (Array.isArray(this._key)) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = /* @__PURE__ */ __name((ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error2 = new ZodError(ctx.common.issues);
            this._error = error2;
            return this._error;
          }
        };
      }
    }, "handleResult");
    __name(processCreateParams, "processCreateParams");
    ZodType = class {
      static {
        __name(this, "ZodType");
      }
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        const ctx = {
          common: {
            issues: [],
            async: params?.async ?? false,
            contextualErrorMap: params?.errorMap
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      "~validate"(data) {
        const ctx = {
          common: {
            issues: [],
            async: !!this["~standard"].async
          },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        if (!this["~standard"].async) {
          try {
            const result = this._parseSync({ data, path: [], parent: ctx });
            return isValid(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            };
          } catch (err) {
            if (err?.message?.toLowerCase()?.includes("encountered")) {
              this["~standard"].async = true;
            }
            ctx.common = {
              issues: [],
              async: true
            };
          }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        });
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params?.errorMap,
            async: true
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = /* @__PURE__ */ __name((val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        }, "getIssueProperties");
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = /* @__PURE__ */ __name(() => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          }), "setError");
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: /* @__PURE__ */ __name((data) => this["~validate"](data), "validate")
        };
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
    ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    __name(timeRegexSource, "timeRegexSource");
    __name(timeRegex, "timeRegex");
    __name(datetimeRegex, "datetimeRegex");
    __name(isValidIP, "isValidIP");
    __name(isValidJWT, "isValidJWT");
    __name(isValidCidr, "isValidCidr");
    ZodString = class _ZodString extends ZodType {
      static {
        __name(this, "ZodString");
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      base64url(message) {
        return this._addCheck({
          kind: "base64url",
          ...errorUtil.errToObj(message)
        });
      }
      jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
      }
      ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          offset: options?.offset ?? false,
          local: options?.local ?? false,
          ...errorUtil.errToObj(options?.message)
        });
      }
      date(message) {
        return this._addCheck({ kind: "date", message });
      }
      time(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          ...errorUtil.errToObj(options?.message)
        });
      }
      duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message)
        });
      }
      includes(value, options) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options?.position,
          ...errorUtil.errToObj(options?.message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message)
        });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    __name(floatSafeRemainder, "floatSafeRemainder");
    ZodNumber = class _ZodNumber extends ZodType {
      static {
        __name(this, "ZodNumber");
      }
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message)
        });
      }
      safe(message) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      static {
        __name(this, "ZodBigInt");
      }
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          try {
            input.data = BigInt(input.data);
          } catch {
            return this._getInvalidInput(input);
          }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          return this._getInvalidInput(input);
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.bigint,
          received: ctx.parsedType
        });
        return INVALID;
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      static {
        __name(this, "ZodBoolean");
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      static {
        __name(this, "ZodDate");
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (Number.isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      static {
        __name(this, "ZodSymbol");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      static {
        __name(this, "ZodUndefined");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      static {
        __name(this, "ZodNull");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      static {
        __name(this, "ZodAny");
      }
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      static {
        __name(this, "ZodUnknown");
      }
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      static {
        __name(this, "ZodNever");
      }
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      static {
        __name(this, "ZodVoid");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      static {
        __name(this, "ZodArray");
      }
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i2) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i2));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i2) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i2));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    __name(deepPartialify, "deepPartialify");
    ZodObject = class _ZodObject extends ZodType {
      static {
        __name(this, "ZodObject");
      }
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") ;
          else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: /* @__PURE__ */ __name((issue, ctx) => {
              const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: errorUtil.errToObj(message).message ?? defaultError
                };
              return {
                message: defaultError
              };
            }, "errorMap")
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: /* @__PURE__ */ __name(() => ({
            ...this._def.shape(),
            ...augmentation
          }), "shape")
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: /* @__PURE__ */ __name(() => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }), "shape"),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        for (const key of util.objectKeys(mask)) {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: /* @__PURE__ */ __name(() => shape, "shape")
        });
      }
      omit(mask) {
        const shape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: /* @__PURE__ */ __name(() => shape, "shape")
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: /* @__PURE__ */ __name(() => newShape, "shape")
        });
      }
      required(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: /* @__PURE__ */ __name(() => newShape, "shape")
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: /* @__PURE__ */ __name(() => shape, "shape"),
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: /* @__PURE__ */ __name(() => shape, "shape"),
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      static {
        __name(this, "ZodUnion");
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        __name(handleResults, "handleResults");
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    __name(mergeValues, "mergeValues");
    ZodIntersection = class extends ZodType {
      static {
        __name(this, "ZodIntersection");
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        }, "handleParsed");
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      static {
        __name(this, "ZodTuple");
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodMap = class extends ZodType {
      static {
        __name(this, "ZodMap");
      }
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      static {
        __name(this, "ZodSet");
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        __name(finalizeSet, "finalizeSet");
        const elements = [...ctx.data.values()].map((item, i2) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i2)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodLazy = class extends ZodType {
      static {
        __name(this, "ZodLazy");
      }
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      static {
        __name(this, "ZodLiteral");
      }
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    __name(createZodEnum, "createZodEnum");
    ZodEnum = class _ZodEnum extends ZodType {
      static {
        __name(this, "ZodEnum");
      }
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(this._def.values);
        }
        if (!this._cache.has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      static {
        __name(this, "ZodNativeEnum");
      }
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(util.getValidEnumValues(this._def.values));
        }
        if (!this._cache.has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      static {
        __name(this, "ZodPromise");
      }
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      static {
        __name(this, "ZodEffects");
      }
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: /* @__PURE__ */ __name((arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          }, "addIssue"),
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = /* @__PURE__ */ __name((acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          }, "executeRefinement");
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return INVALID;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return INVALID;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                status: status.value,
                value: result
              }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      static {
        __name(this, "ZodOptional");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      static {
        __name(this, "ZodNullable");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      static {
        __name(this, "ZodDefault");
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      static {
        __name(this, "ZodCatch");
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      static {
        __name(this, "ZodNaN");
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    ZodBranded = class extends ZodType {
      static {
        __name(this, "ZodBranded");
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      static {
        __name(this, "ZodPipeline");
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = /* @__PURE__ */ __name(async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          }, "handleAsync");
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a2, b) {
        return new _ZodPipeline({
          in: a2,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      static {
        __name(this, "ZodReadonly");
      }
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = /* @__PURE__ */ __name((data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        }, "freeze");
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    __name(cleanParams, "cleanParams");
    __name(custom, "custom");
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    ZodAny.create;
    ZodNever.create;
    ZodArray.create;
    ZodUnion.create;
    ZodIntersection.create;
    ZodTuple.create;
    enumType = ZodEnum.create;
    ZodPromise.create;
    ZodOptional.create;
    ZodNullable.create;
    ALGORITHMS = {
      "SHA-256": "sha256-",
      "SHA-384": "sha384-",
      "SHA-512": "sha512-"
    };
    ALGORITHM_VALUES = Object.values(ALGORITHMS);
    enumType(Object.keys(ALGORITHMS)).optional().default("SHA-256");
    custom((value) => {
      if (typeof value !== "string") {
        return false;
      }
      return ALGORITHM_VALUES.some((allowedValue) => {
        return value.startsWith(allowedValue);
      });
    });
    ALLOWED_DIRECTIVES = [
      "base-uri",
      "child-src",
      "connect-src",
      "default-src",
      "fenced-frame-src",
      "font-src",
      "form-action",
      "frame-ancestors",
      "frame-src",
      "img-src",
      "manifest-src",
      "media-src",
      "object-src",
      "referrer",
      "report-to",
      "report-uri",
      "require-trusted-types-for",
      "sandbox",
      "trusted-types",
      "upgrade-insecure-requests",
      "worker-src"
    ];
    custom((value) => {
      if (typeof value !== "string") {
        return false;
      }
      return ALLOWED_DIRECTIVES.some((allowedValue) => {
        return value.startsWith(allowedValue);
      });
    });
    ALGORITHM = "AES-GCM";
    __name(decodeKey, "decodeKey");
    encoder$1 = new TextEncoder();
    decoder$1 = new TextDecoder();
    IV_LENGTH = 24;
    __name(encryptString, "encryptString");
    __name(decryptString, "decryptString");
    __name(generateCspDigest, "generateCspDigest");
    renderTemplateResultSym = /* @__PURE__ */ Symbol.for("astro.renderTemplateResult");
    RenderTemplateResult = class {
      static {
        __name(this, "RenderTemplateResult");
      }
      [renderTemplateResultSym] = true;
      htmlParts;
      expressions;
      error;
      constructor(htmlParts, expressions) {
        this.htmlParts = htmlParts;
        this.error = void 0;
        this.expressions = expressions.map((expression) => {
          if (isPromise(expression)) {
            return Promise.resolve(expression).catch((err) => {
              if (!this.error) {
                this.error = err;
                throw err;
              }
            });
          }
          return expression;
        });
      }
      render(destination) {
        const flushers = this.expressions.map((exp) => {
          return createBufferedRenderer(destination, (bufferDestination) => {
            if (exp || exp === 0) {
              return renderChild(bufferDestination, exp);
            }
          });
        });
        let i2 = 0;
        const iterate = /* @__PURE__ */ __name(() => {
          while (i2 < this.htmlParts.length) {
            const html = this.htmlParts[i2];
            const flusher = flushers[i2];
            i2++;
            if (html) {
              destination.write(markHTMLString(html));
            }
            if (flusher) {
              const result = flusher.flush();
              if (isPromise(result)) {
                return result.then(iterate);
              }
            }
          }
        }, "iterate");
        return iterate();
      }
    };
    __name(isRenderTemplateResult, "isRenderTemplateResult");
    __name(renderTemplate, "renderTemplate");
    slotString = /* @__PURE__ */ Symbol.for("astro:slot-string");
    SlotString = class extends HTMLString {
      static {
        __name(this, "SlotString");
      }
      instructions;
      [slotString];
      constructor(content, instructions) {
        super(content);
        this.instructions = instructions;
        this[slotString] = true;
      }
    };
    __name(isSlotString, "isSlotString");
    __name(mergeSlotInstructions, "mergeSlotInstructions");
    __name(renderSlot, "renderSlot");
    __name(renderSlotToString, "renderSlotToString");
    __name(renderSlots, "renderSlots");
    __name(createSlotValueFromString, "createSlotValueFromString");
    internalProps = /* @__PURE__ */ new Set([
      "server:component-path",
      "server:component-export",
      "server:component-directive",
      "server:defer"
    ]);
    __name(containsServerDirective, "containsServerDirective");
    SCRIPT_RE = /<\/script/giu;
    COMMENT_RE = /<!--/gu;
    SCRIPT_REPLACER = "<\\/script";
    COMMENT_REPLACER = "\\u003C!--";
    __name(safeJsonStringify, "safeJsonStringify");
    __name(createSearchParams, "createSearchParams");
    __name(isWithinURLLimit, "isWithinURLLimit");
    ServerIslandComponent = class {
      static {
        __name(this, "ServerIslandComponent");
      }
      result;
      props;
      slots;
      displayName;
      hostId;
      islandContent;
      componentPath;
      componentExport;
      componentId;
      constructor(result, props, slots, displayName) {
        this.result = result;
        this.props = props;
        this.slots = slots;
        this.displayName = displayName;
      }
      async init() {
        const content = await this.getIslandContent();
        if (this.result.cspDestination) {
          this.result._metadata.extraScriptHashes.push(
            await generateCspDigest(SERVER_ISLAND_REPLACER, this.result.cspAlgorithm)
          );
          const contentDigest = await generateCspDigest(content, this.result.cspAlgorithm);
          this.result._metadata.extraScriptHashes.push(contentDigest);
        }
        return createThinHead();
      }
      async render(destination) {
        const hostId = await this.getHostId();
        const islandContent = await this.getIslandContent();
        destination.write(createRenderInstruction({ type: "server-island-runtime" }));
        destination.write("<!--[if astro]>server-island-start<![endif]-->");
        for (const name in this.slots) {
          if (name === "fallback") {
            await renderChild(destination, this.slots.fallback(this.result));
          }
        }
        destination.write(
          `<script type="module" data-astro-rerun data-island-id="${hostId}">${islandContent}<\/script>`
        );
      }
      getComponentPath() {
        if (this.componentPath) {
          return this.componentPath;
        }
        const componentPath = this.props["server:component-path"];
        if (!componentPath) {
          throw new Error(`Could not find server component path`);
        }
        this.componentPath = componentPath;
        return componentPath;
      }
      getComponentExport() {
        if (this.componentExport) {
          return this.componentExport;
        }
        const componentExport = this.props["server:component-export"];
        if (!componentExport) {
          throw new Error(`Could not find server component export`);
        }
        this.componentExport = componentExport;
        return componentExport;
      }
      async getHostId() {
        if (!this.hostId) {
          this.hostId = await crypto.randomUUID();
        }
        return this.hostId;
      }
      async getIslandContent() {
        if (this.islandContent) {
          return this.islandContent;
        }
        const componentPath = this.getComponentPath();
        const componentExport = this.getComponentExport();
        const componentId = this.result.serverIslandNameMap.get(componentPath);
        if (!componentId) {
          throw new Error(`Could not find server component name`);
        }
        for (const key2 of Object.keys(this.props)) {
          if (internalProps.has(key2)) {
            delete this.props[key2];
          }
        }
        const renderedSlots = {};
        for (const name in this.slots) {
          if (name !== "fallback") {
            const content = await renderSlotToString(this.result, this.slots[name]);
            renderedSlots[name] = content.toString();
          }
        }
        const key = await this.result.key;
        const componentExportEncrypted = await encryptString(key, componentExport);
        const propsEncrypted = Object.keys(this.props).length === 0 ? "" : await encryptString(key, JSON.stringify(this.props));
        const slotsEncrypted = Object.keys(renderedSlots).length === 0 ? "" : await encryptString(key, JSON.stringify(renderedSlots));
        const hostId = await this.getHostId();
        const slash2 = this.result.base.endsWith("/") ? "" : "/";
        let serverIslandUrl = `${this.result.base}${slash2}_server-islands/${componentId}${this.result.trailingSlash === "always" ? "/" : ""}`;
        const potentialSearchParams = createSearchParams(
          componentExportEncrypted,
          propsEncrypted,
          slotsEncrypted
        );
        const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
        if (useGETRequest) {
          serverIslandUrl += "?" + potentialSearchParams.toString();
          this.result._metadata.extraHead.push(
            markHTMLString(
              `<link rel="preload" as="fetch" href="${serverIslandUrl}" crossorigin="anonymous">`
            )
          );
        }
        const adapterHeaders = this.result.internalFetchHeaders || {};
        const headersJson = safeJsonStringify(adapterHeaders);
        const method = useGETRequest ? (
          // GET request
          `const headers = new Headers(${headersJson});
let response = await fetch('${serverIslandUrl}', { headers });`
        ) : (
          // POST request
          `let data = {
	encryptedComponentExport: ${safeJsonStringify(componentExportEncrypted)},
	encryptedProps: ${safeJsonStringify(propsEncrypted)},
	encryptedSlots: ${safeJsonStringify(slotsEncrypted)},
};
const headers = new Headers({ 'Content-Type': 'application/json', ...${headersJson} });
let response = await fetch('${serverIslandUrl}', {
	method: 'POST',
	body: JSON.stringify(data),
	headers,
});`
        );
        this.islandContent = `${method}replaceServerIsland('${hostId}', response);`;
        return this.islandContent;
      }
    };
    renderServerIslandRuntime = /* @__PURE__ */ __name(() => {
      return `<script>${SERVER_ISLAND_REPLACER}<\/script>`;
    }, "renderServerIslandRuntime");
    SERVER_ISLAND_REPLACER = markHTMLString(
      `async function replaceServerIsland(id, r) {
	let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
	// If there's no matching script, or the request fails then return
	if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
	// Load the HTML before modifying the DOM in case of errors
	let html = await r.text();
	// Remove any placeholder content before the island script
	while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '[if astro]>server-island-start<![endif]')
		s.previousSibling.remove();
	s.previousSibling?.remove();
	// Insert the new HTML
	s.before(document.createRange().createContextualFragment(html));
	// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
	s.remove();
}`.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("//")).join(" ")
    );
    Fragment = /* @__PURE__ */ Symbol.for("astro:fragment");
    Renderer = /* @__PURE__ */ Symbol.for("astro:renderer");
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    __name(stringifyChunk, "stringifyChunk");
    __name(chunkToString, "chunkToString");
    __name(chunkToByteArray, "chunkToByteArray");
    __name(chunkToByteArrayOrString, "chunkToByteArrayOrString");
    __name(isRenderInstance, "isRenderInstance");
    __name(renderChild, "renderChild");
    __name(renderArray, "renderArray");
    __name(renderIterable, "renderIterable");
    __name(renderAsyncIterable, "renderAsyncIterable");
    astroComponentInstanceSym = /* @__PURE__ */ Symbol.for("astro.componentInstance");
    AstroComponentInstance = class {
      static {
        __name(this, "AstroComponentInstance");
      }
      [astroComponentInstanceSym] = true;
      result;
      props;
      slotValues;
      factory;
      returnValue;
      constructor(result, props, slots, factory) {
        this.result = result;
        this.props = props;
        this.factory = factory;
        this.slotValues = {};
        for (const name in slots) {
          let didRender = false;
          let value = slots[name](result);
          this.slotValues[name] = () => {
            if (!didRender) {
              didRender = true;
              return value;
            }
            return slots[name](result);
          };
        }
      }
      init(result) {
        if (this.returnValue !== void 0) {
          return this.returnValue;
        }
        this.returnValue = this.factory(result, this.props, this.slotValues);
        if (isPromise(this.returnValue)) {
          this.returnValue.then((resolved) => {
            this.returnValue = resolved;
          }).catch(() => {
          });
        }
        return this.returnValue;
      }
      render(destination) {
        const returnValue = this.init(this.result);
        if (isPromise(returnValue)) {
          return returnValue.then((x) => this.renderImpl(destination, x));
        }
        return this.renderImpl(destination, returnValue);
      }
      renderImpl(destination, returnValue) {
        if (isHeadAndContent(returnValue)) {
          return returnValue.content.render(destination);
        } else {
          return renderChild(destination, returnValue);
        }
      }
    };
    __name(validateComponentProps, "validateComponentProps");
    __name(createAstroComponentInstance, "createAstroComponentInstance");
    __name(isAstroComponentInstance, "isAstroComponentInstance");
    DOCTYPE_EXP = /<!doctype html/i;
    __name(renderToString, "renderToString");
    __name(renderToReadableStream, "renderToReadableStream");
    __name(callComponentAsTemplateResultOrResponse, "callComponentAsTemplateResultOrResponse");
    __name(bufferHeadContent, "bufferHeadContent");
    __name(renderToAsyncIterable, "renderToAsyncIterable");
    __name(toPromise, "toPromise");
    __name(componentIsHTMLElement, "componentIsHTMLElement");
    __name(renderHTMLElement, "renderHTMLElement");
    __name(getHTMLElementName, "getHTMLElementName");
    needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
    rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
    clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
    __name(guessRenderers, "guessRenderers");
    __name(isFragmentComponent, "isFragmentComponent");
    __name(isHTMLComponent, "isHTMLComponent");
    ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
    ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
    __name(removeStaticAstroSlot, "removeStaticAstroSlot");
    __name(renderFrameworkComponent, "renderFrameworkComponent");
    __name(sanitizeElementName, "sanitizeElementName");
    __name(renderFragmentComponent, "renderFragmentComponent");
    __name(renderHTMLComponent, "renderHTMLComponent");
    __name(renderAstroComponent, "renderAstroComponent");
    __name(renderComponent, "renderComponent");
    __name(normalizeProps, "normalizeProps");
    __name(renderComponentToString, "renderComponentToString");
    __name(nonAstroPageNeedsHeadInjection, "nonAstroPageNeedsHeadInjection");
    ClientOnlyPlaceholder = "astro-client-only";
    hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
    __name(renderJSX, "renderJSX");
    __name(renderJSXVNode, "renderJSXVNode");
    __name(renderElement, "renderElement");
    __name(prerenderElementChildren, "prerenderElementChildren");
    __name(renderPage, "renderPage");
    __name(requireCssesc, "requireCssesc");
    requireCssesc();
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
    "-0123456789_".split("").reduce((v, c) => (v[c.charCodeAt(0)] = c, v), []);
    __name(spreadAttributes, "spreadAttributes");
  }
});

// dist/_worker.js/chunks/astro-designed-error-pages_qRxMrroR.mjs
function is_primitive(thing) {
  return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i2 = 0; i2 < len; i2 += 1) {
    const char = str[i2];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i2) + replacement;
      last_pos = i2 + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n2) {
  if (!Number.isInteger(n2)) return false;
  if (n2 < 0) return false;
  if (n2 > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_len(n2) {
  if (!Number.isInteger(n2)) return false;
  if (n2 < 0) return false;
  if (n2 > MAX_ARRAY_LEN) return false;
  return true;
}
function is_valid_array_index_string(s2) {
  if (s2.length === 0) return false;
  if (s2.length > 1 && s2.charCodeAt(0) === 48) return false;
  for (let i2 = 0; i2 < s2.length; i2++) {
    const c = s2.charCodeAt(i2);
    if (c < 48 || c > 57) return false;
  }
  return is_valid_array_index(+s2);
}
function valid_array_indices(array) {
  const keys = Object.keys(array);
  for (var i2 = keys.length - 1; i2 >= 0; i2--) {
    if (is_valid_array_index_string(keys[i2])) {
      break;
    }
  }
  keys.length = i2 + 1;
  return keys;
}
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base64) {
  return Uint8Array.fromBase64(base64).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base64) {
  return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array = new Uint8Array(array_buffer);
  let binary2 = "";
  const chunk_size = 32768;
  for (let i2 = 0; i2 < array.length; i2 += chunk_size) {
    const chunk = array.subarray(i2, i2 + chunk_size);
    binary2 += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary2);
}
function decode_legacy(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const array = new Uint8Array(len);
  for (let i2 = 0; i2 < len; i2++) {
    array[i2] = binary_string.charCodeAt(i2);
  }
  return array.buffer;
}
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
function unflatten(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i2 = value[1];
          if (typeof i2 !== "number") {
            i2 = values.push(value[1]) - 1;
          }
          if (Object.hasOwn(hydrated, i2)) {
            return hydrated[index] = reviver(hydrated[i2]);
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i2)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i2);
          hydrated[index] = reviver(hydrate(i2));
          hydrating.delete(i2);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i2 = 1; i2 < value.length; i2 += 1) {
              set.add(hydrate(value[i2]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              map.set(hydrate(value[i2]), hydrate(value[i2 + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") {
              throw new Error("Invalid input");
            }
            hydrated[index] = Object(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              if (value[i2] === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              obj[value[i2]] = hydrate(value[i2 + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer2 = hydrate(value[1]);
            hydrated[index] = value[2] !== void 0 ? new TypedArrayConstructor(buffer2, value[2], value[3]) : new TypedArrayConstructor(buffer2);
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!is_valid_array_len(len)) {
          throw new Error("Invalid input");
        }
        const array = [];
        hydrated[index] = array;
        array[MAX_ARRAY_INDEX] = void 0;
        delete array[MAX_ARRAY_INDEX];
        for (let i2 = 2; i2 < value.length; i2 += 2) {
          const idx = value[i2];
          if (!is_valid_array_index(idx) || idx >= len) {
            throw new Error("Invalid input");
          }
          array[idx] = hydrate(value[i2 + 1]);
        }
        array.length = len;
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          const n2 = value[i2];
          if (n2 === HOLE) continue;
          array[i2] = hydrate(n2);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n2 = value[key];
        object[key] = hydrate(n2);
      }
    }
    return hydrated[index];
  }
  __name(hydrate, "hydrate");
  return hydrate(0);
}
function stringify(value, reducers) {
  const stringified = run(false, value, reducers);
  return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
function run(async, value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom2 = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom2.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p = 0;
  function flatten(thing, index2) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return (
      /** @type {number} */
      indexes.get(thing)
    );
    index2 ??= p++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom2) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    } else if (typeof thing === "symbol") {
      throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else if (typeof thing.then === "function") {
      {
        throw new DevalueError(
          `Cannot stringify a Promise or thenable \u2014 use stringifyAsync instead`,
          keys,
          thing,
          value
        );
      }
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(thing.valueOf())}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i2 = 0; i2 < thing.length; i2 += 1) {
            if (i2 > 0) str += ",";
            if (Object.hasOwn(thing, i2)) {
              keys.push(`[${i2}]`);
              str += flatten(thing[i2]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d + population * (d + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j = 0; j < populated_keys.length; j++) {
                  const key = populated_keys[j];
                  keys.push(`[${key}]`);
                  str += "," + key + "," + flatten(thing[key]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          if (typedArray.byteLength !== typedArray.buffer.byteLength) {
            str += `,${typedArray.byteOffset},${typedArray.length}`;
          }
          str += "]";
          break;
        }
        case "DataView": {
          const view = thing;
          str = '["' + type + '",' + flatten(view.buffer);
          if (view.byteLength !== view.buffer.byteLength) {
            str += `,${view.byteOffset},${view.byteLength}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  __name(flatten, "flatten");
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return stringified;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS$1.actionName]: name });
  return `?${searchParams.toString()}`;
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, {})?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify(res.data, {
      // Add support for URL objects
      URL: /* @__PURE__ */ __name((value) => value instanceof URL && value.href, "URL")
    });
  } catch (e2) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e2)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__, {})?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: /* @__PURE__ */ __name((href) => new URL(href), "URL")
    }),
    error: void 0
  };
}
function template({
  title,
  pathname,
  statusCode = 404,
  tabTitle,
  body
}) {
  return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
async function default404Page({ pathname }) {
  return new Response(
    template({
      statusCode: 404,
      title: "Not found",
      tabTitle: "404: Not Found",
      pathname
    }),
    { status: 404, headers: { "Content-Type": "text/html" } }
  );
}
var ACTION_QUERY_PARAMS$1, ACTION_RPC_ROUTE_PATTERN, UNDEFINED, HOLE, NAN, POSITIVE_INFINITY, NEGATIVE_INFINITY, NEGATIVE_ZERO, SPARSE, MAX_ARRAY_LEN, MAX_ARRAY_INDEX, DevalueError, object_proto_names, is_identifier, native, buffer, encode64, decode64, __vite_import_meta_env__, ACTION_QUERY_PARAMS, codeToStatusMap, statusToCodeMap, ActionError, ActionInputError, actionResultErrorStack, ImportType, E, DEFAULT_404_ROUTE, default404Instance;
var init_astro_designed_error_pages_qRxMrroR = __esm({
  "dist/_worker.js/chunks/astro-designed-error-pages_qRxMrroR.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_CG2QLMoV();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    ACTION_QUERY_PARAMS$1 = {
      actionName: "_action"
    };
    ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";
    UNDEFINED = -1;
    HOLE = -2;
    NAN = -3;
    POSITIVE_INFINITY = -4;
    NEGATIVE_INFINITY = -5;
    NEGATIVE_ZERO = -6;
    SPARSE = -7;
    MAX_ARRAY_LEN = 2 ** 32 - 1;
    MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
    DevalueError = class extends Error {
      static {
        __name(this, "DevalueError");
      }
      /**
       * @param {string} message
       * @param {string[]} keys
       * @param {any} [value] - The value that failed to be serialized
       * @param {any} [root] - The root value being serialized
       */
      constructor(message, keys, value, root) {
        super(message);
        this.name = "DevalueError";
        this.path = keys.join("");
        this.value = value;
        this.root = root;
      }
    };
    __name(is_primitive, "is_primitive");
    object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    __name(is_plain_object, "is_plain_object");
    __name(get_type, "get_type");
    __name(get_escaped_char, "get_escaped_char");
    __name(stringify_string, "stringify_string");
    __name(enumerable_symbols, "enumerable_symbols");
    is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    __name(stringify_key, "stringify_key");
    __name(is_valid_array_index, "is_valid_array_index");
    __name(is_valid_array_len, "is_valid_array_len");
    __name(is_valid_array_index_string, "is_valid_array_index_string");
    __name(valid_array_indices, "valid_array_indices");
    __name(encode_native, "encode_native");
    __name(decode_native, "decode_native");
    __name(encode_buffer, "encode_buffer");
    __name(decode_buffer, "decode_buffer");
    __name(encode_legacy, "encode_legacy");
    __name(decode_legacy, "decode_legacy");
    native = typeof Uint8Array.fromBase64 === "function";
    buffer = typeof process === "object" && process.versions?.node !== void 0;
    encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
    decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
    __name(parse, "parse");
    __name(unflatten, "unflatten");
    __name(stringify, "stringify");
    __name(run, "run");
    __name(stringify_primitive, "stringify_primitive");
    __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://watchiangman.com", "SSR": true };
    ACTION_QUERY_PARAMS = ACTION_QUERY_PARAMS$1;
    codeToStatusMap = {
      // Implemented from IANA HTTP Status Code Registry
      // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTHENTICATION_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      CONTENT_TOO_LARGE: 413,
      URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417,
      MISDIRECTED_REQUEST: 421,
      UNPROCESSABLE_CONTENT: 422,
      LOCKED: 423,
      FAILED_DEPENDENCY: 424,
      TOO_EARLY: 425,
      UPGRADE_REQUIRED: 426,
      PRECONDITION_REQUIRED: 428,
      TOO_MANY_REQUESTS: 429,
      REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
      UNAVAILABLE_FOR_LEGAL_REASONS: 451,
      INTERNAL_SERVER_ERROR: 500,
      NOT_IMPLEMENTED: 501,
      BAD_GATEWAY: 502,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
      HTTP_VERSION_NOT_SUPPORTED: 505,
      VARIANT_ALSO_NEGOTIATES: 506,
      INSUFFICIENT_STORAGE: 507,
      LOOP_DETECTED: 508,
      NETWORK_AUTHENTICATION_REQUIRED: 511
    };
    statusToCodeMap = Object.entries(codeToStatusMap).reduce(
      // reverse the key-value pairs
      (acc, [key, value]) => ({ ...acc, [value]: key }),
      {}
    );
    ActionError = class _ActionError extends Error {
      static {
        __name(this, "ActionError");
      }
      type = "AstroActionError";
      code = "INTERNAL_SERVER_ERROR";
      status = 500;
      constructor(params) {
        super(params.message);
        this.code = params.code;
        this.status = _ActionError.codeToStatus(params.code);
        if (params.stack) {
          this.stack = params.stack;
        }
      }
      static codeToStatus(code) {
        return codeToStatusMap[code];
      }
      static statusToCode(status) {
        return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
      }
      static fromJson(body) {
        if (isInputError(body)) {
          return new ActionInputError(body.issues);
        }
        if (isActionError(body)) {
          return new _ActionError(body);
        }
        return new _ActionError({
          code: "INTERNAL_SERVER_ERROR"
        });
      }
    };
    __name(isActionError, "isActionError");
    __name(isInputError, "isInputError");
    ActionInputError = class extends ActionError {
      static {
        __name(this, "ActionInputError");
      }
      type = "AstroActionInputError";
      // We don't expose all ZodError properties.
      // Not all properties will serialize from server to client,
      // and we don't want to import the full ZodError object into the client.
      issues;
      fields;
      constructor(issues) {
        super({
          message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
          code: "BAD_REQUEST"
        });
        this.issues = issues;
        this.fields = {};
        for (const issue of issues) {
          if (issue.path.length > 0) {
            const key = issue.path[0].toString();
            this.fields[key] ??= [];
            this.fields[key]?.push(issue.message);
          }
        }
      }
    };
    __name(getActionQueryString, "getActionQueryString");
    __name(serializeActionResult, "serializeActionResult");
    __name(deserializeActionResult, "deserializeActionResult");
    actionResultErrorStack = /* @__PURE__ */ (/* @__PURE__ */ __name((function actionResultErrorStackFn() {
      let errorStack;
      return {
        set(stack) {
          errorStack = stack;
        },
        get() {
          return errorStack;
        }
      };
    }), "actionResultErrorStackFn"))();
    !(function(A) {
      A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase";
    })(ImportType || (ImportType = {}));
    1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
    E = /* @__PURE__ */ __name(() => {
      return A = "AGFzbQEAAAABKwhgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gA39/fwADMTAAAQECAgICAgICAgICAgICAgICAgIAAwMDBAQAAAUAAAAAAAMDAwAGAAAABwAGAgUEBQFwAQEBBQMBAAEGDwJ/AUHA8gALfwBBwPIACwd6FQZtZW1vcnkCAAJzYQAAAWUAAwJpcwAEAmllAAUCc3MABgJzZQAHAml0AAgCYWkACQJpZAAKAmlwAAsCZXMADAJlZQANA2VscwAOA2VsZQAPAnJpABACcmUAEQFmABICbXMAEwVwYXJzZQAUC19faGVhcF9iYXNlAwEKzkQwaAEBf0EAIAA2AoAKQQAoAtwJIgEgAEEBdGoiAEEAOwEAQQAgAEECaiIANgKECkEAIAA2AogKQQBBADYC4AlBAEEANgLwCUEAQQA2AugJQQBBADYC5AlBAEEANgL4CUEAQQA2AuwJIAEL0wEBA39BACgC8AkhBEEAQQAoAogKIgU2AvAJQQAgBDYC9AlBACAFQSRqNgKICiAEQSBqQeAJIAQbIAU2AgBBACgC1AkhBEEAKALQCSEGIAUgATYCACAFIAA2AgggBSACIAJBAmpBACAGIANGIgAbIAQgA0YiBBs2AgwgBSADNgIUIAVBADYCECAFIAI2AgQgBUEANgIgIAVBA0EBQQIgABsgBBs2AhwgBUEAKALQCSADRiICOgAYAkACQCACDQBBACgC1AkgA0cNAQtBAEEBOgCMCgsLXgEBf0EAKAL4CSIEQRBqQeQJIAQbQQAoAogKIgQ2AgBBACAENgL4CUEAIARBFGo2AogKQQBBAToAjAogBEEANgIQIAQgAzYCDCAEIAI2AgggBCABNgIEIAQgADYCAAsIAEEAKAKQCgsVAEEAKALoCSgCAEEAKALcCWtBAXULHgEBf0EAKALoCSgCBCIAQQAoAtwJa0EBdUF/IAAbCxUAQQAoAugJKAIIQQAoAtwJa0EBdQseAQF/QQAoAugJKAIMIgBBACgC3AlrQQF1QX8gABsLCwBBACgC6AkoAhwLHgEBf0EAKALoCSgCECIAQQAoAtwJa0EBdUF/IAAbCzsBAX8CQEEAKALoCSgCFCIAQQAoAtAJRw0AQX8PCwJAIABBACgC1AlHDQBBfg8LIABBACgC3AlrQQF1CwsAQQAoAugJLQAYCxUAQQAoAuwJKAIAQQAoAtwJa0EBdQsVAEEAKALsCSgCBEEAKALcCWtBAXULHgEBf0EAKALsCSgCCCIAQQAoAtwJa0EBdUF/IAAbCx4BAX9BACgC7AkoAgwiAEEAKALcCWtBAXVBfyAAGwslAQF/QQBBACgC6AkiAEEgakHgCSAAGygCACIANgLoCSAAQQBHCyUBAX9BAEEAKALsCSIAQRBqQeQJIAAbKAIAIgA2AuwJIABBAEcLCABBAC0AlAoLCABBAC0AjAoL3Q0BBX8jAEGA0ABrIgAkAEEAQQE6AJQKQQBBACgC2Ak2ApwKQQBBACgC3AlBfmoiATYCsApBACABQQAoAoAKQQF0aiICNgK0CkEAQQA6AIwKQQBBADsBlgpBAEEAOwGYCkEAQQA6AKAKQQBBADYCkApBAEEAOgD8CUEAIABBgBBqNgKkCkEAIAA2AqgKQQBBADoArAoCQAJAAkACQANAQQAgAUECaiIDNgKwCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BmAoNASADEBVFDQEgAUEEakGCCEEKEC8NARAWQQAtAJQKDQFBAEEAKAKwCiIBNgKcCgwHCyADEBVFDQAgAUEEakGMCEEKEC8NABAXC0EAQQAoArAKNgKcCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAYDAELQQEQGQtBACgCtAohAkEAKAKwCiEBDAALC0EAIQIgAyEBQQAtAPwJDQIMAQtBACABNgKwCkEAQQA6AJQKCwNAQQAgAUECaiIDNgKwCgJAAkACQAJAAkACQAJAIAFBACgCtApPDQAgAy8BACICQXdqQQVJDQYCQAJAAkACQAJAAkACQAJAAkACQCACQWBqDgoQDwYPDw8PBQECAAsCQAJAAkACQCACQaB/ag4KCxISAxIBEhISAgALIAJBhX9qDgMFEQYJC0EALwGYCg0QIAMQFUUNECABQQRqQYIIQQoQLw0QEBYMEAsgAxAVRQ0PIAFBBGpBjAhBChAvDQ8QFwwPCyADEBVFDQ4gASkABELsgISDsI7AOVINDiABLwEMIgNBd2oiAUEXSw0MQQEgAXRBn4CABHFFDQwMDQtBAEEALwGYCiIBQQFqOwGYCkEAKAKkCiABQQN0aiIBQQE2AgAgAUEAKAKcCjYCBAwNC0EALwGYCiIDRQ0JQQAgA0F/aiIDOwGYCkEALwGWCiICRQ0MQQAoAqQKIANB//8DcUEDdGooAgBBBUcNDAJAIAJBAnRBACgCqApqQXxqKAIAIgMoAgQNACADQQAoApwKQQJqNgIEC0EAIAJBf2o7AZYKIAMgAUEEajYCDAwMCwJAQQAoApwKIgEvAQBBKUcNAEEAKALwCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAvQJIgM2AvAJAkAgA0UNACADQQA2AiAMAQtBAEEANgLgCQtBAEEALwGYCiIDQQFqOwGYCkEAKAKkCiADQQN0aiIDQQZBAkEALQCsChs2AgAgAyABNgIEQQBBADoArAoMCwtBAC8BmAoiAUUNB0EAIAFBf2oiATsBmApBACgCpAogAUH//wNxQQN0aigCAEEERg0EDAoLQScQGgwJC0EiEBoMCAsgAkEvRw0HAkACQCABLwEEIgFBKkYNACABQS9HDQEQGAwKC0EBEBkMCQsCQAJAAkACQEEAKAKcCiIBLwEAIgMQG0UNAAJAAkAgA0FVag4EAAkBAwkLIAFBfmovAQBBK0YNAwwICyABQX5qLwEAQS1GDQIMBwsgA0EpRw0BQQAoAqQKQQAvAZgKIgJBA3RqKAIEEBxFDQIMBgsgAUF+ai8BAEFQakH//wNxQQpPDQULQQAvAZgKIQILAkACQCACQf//A3EiAkUNACADQeYARw0AQQAoAqQKIAJBf2pBA3RqIgQoAgBBAUcNACABQX5qLwEAQe8ARw0BIAQoAgRBlghBAxAdRQ0BDAULIANB/QBHDQBBACgCpAogAkEDdGoiAigCBBAeDQQgAigCAEEGRg0ECyABEB8NAyADRQ0DIANBL0ZBAC0AoApBAEdxDQMCQEEAKAL4CSICRQ0AIAEgAigCAEkNACABIAIoAgRNDQQLIAFBfmohAUEAKALcCSECAkADQCABQQJqIgQgAk0NAUEAIAE2ApwKIAEvAQAhAyABQX5qIgQhASADECBFDQALIARBAmohBAsCQCADQf//A3EQIUUNACAEQX5qIQECQANAIAFBAmoiAyACTQ0BQQAgATYCnAogAS8BACEDIAFBfmoiBCEBIAMQIQ0ACyAEQQJqIQMLIAMQIg0EC0EAQQE6AKAKDAcLQQAoAqQKQQAvAZgKIgFBA3QiA2pBACgCnAo2AgRBACABQQFqOwGYCkEAKAKkCiADakEDNgIACxAjDAULQQAtAPwJQQAvAZYKQQAvAZgKcnJFIQIMBwsQJEEAQQA6AKAKDAMLECVBACECDAULIANBoAFHDQELQQBBAToArAoLQQBBACgCsAo2ApwKC0EAKAKwCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC3AkgAEcNAEEBDwsgAEF+ahAmC/4KAQZ/QQBBACgCsAoiAEEMaiIBNgKwCkEAKAL4CSECQQEQKSEDAkACQAJAAkACQAJAAkACQAJAQQAoArAKIgQgAUcNACADEChFDQELAkACQAJAAkACQAJAAkAgA0EqRg0AIANB+wBHDQFBACAEQQJqNgKwCkEBECkhA0EAKAKwCiEEA0ACQAJAIANB//8DcSIDQSJGDQAgA0EnRg0AIAMQLBpBACgCsAohAwwBCyADEBpBAEEAKAKwCkECaiIDNgKwCgtBARApGgJAIAQgAxAtIgNBLEcNAEEAQQAoArAKQQJqNgKwCkEBECkhAwsgA0H9AEYNA0EAKAKwCiIFIARGDQ8gBSEEIAVBACgCtApNDQAMDwsLQQAgBEECajYCsApBARApGkEAKAKwCiIDIAMQLRoMAgtBAEEAOgCUCgJAAkACQAJAAkACQCADQZ9/ag4MAgsEAQsDCwsLCwsFAAsgA0H2AEYNBAwKC0EAIARBDmoiAzYCsAoCQAJAAkBBARApQZ9/ag4GABICEhIBEgtBACgCsAoiBSkAAkLzgOSD4I3AMVINESAFLwEKECFFDRFBACAFQQpqNgKwCkEAECkaC0EAKAKwCiIFQQJqQbIIQQ4QLw0QIAUvARAiAkF3aiIBQRdLDQ1BASABdEGfgIAEcUUNDQwOC0EAKAKwCiIFKQACQuyAhIOwjsA5Ug0PIAUvAQoiAkF3aiIBQRdNDQYMCgtBACAEQQpqNgKwCkEAECkaQQAoArAKIQQLQQAgBEEQajYCsAoCQEEBECkiBEEqRw0AQQBBACgCsApBAmo2ArAKQQEQKSEEC0EAKAKwCiEDIAQQLBogA0EAKAKwCiIEIAMgBBACQQBBACgCsApBfmo2ArAKDwsCQCAEKQACQuyAhIOwjsA5Ug0AIAQvAQoQIEUNAEEAIARBCmo2ArAKQQEQKSEEQQAoArAKIQMgBBAsGiADQQAoArAKIgQgAyAEEAJBAEEAKAKwCkF+ajYCsAoPC0EAIARBBGoiBDYCsAoLQQAgBEEGajYCsApBAEEAOgCUCkEBECkhBEEAKAKwCiEDIAQQLCEEQQAoArAKIQIgBEHf/wNxIgFB2wBHDQNBACACQQJqNgKwCkEBECkhBUEAKAKwCiEDQQAhBAwEC0EAQQE6AIwKQQBBACgCsApBAmo2ArAKC0EBECkhBEEAKAKwCiEDAkAgBEHmAEcNACADQQJqQawIQQYQLw0AQQAgA0EIajYCsAogAEEBEClBABArIAJBEGpB5AkgAhshAwNAIAMoAgAiA0UNBSADQgA3AgggA0EQaiEDDAALC0EAIANBfmo2ArAKDAMLQQEgAXRBn4CABHFFDQMMBAtBASEECwNAAkACQCAEDgIAAQELIAVB//8DcRAsGkEBIQQMAQsCQAJAQQAoArAKIgQgA0YNACADIAQgAyAEEAJBARApIQQCQCABQdsARw0AIARBIHJB/QBGDQQLQQAoArAKIQMCQCAEQSxHDQBBACADQQJqNgKwCkEBECkhBUEAKAKwCiEDIAVBIHJB+wBHDQILQQAgA0F+ajYCsAoLIAFB2wBHDQJBACACQX5qNgKwCg8LQQAhBAwACwsPCyACQaABRg0AIAJB+wBHDQQLQQAgBUEKajYCsApBARApIgVB+wBGDQMMAgsCQCACQVhqDgMBAwEACyACQaABRw0CC0EAIAVBEGo2ArAKAkBBARApIgVBKkcNAEEAQQAoArAKQQJqNgKwCkEBECkhBQsgBUEoRg0BC0EAKAKwCiEBIAUQLBpBACgCsAoiBSABTQ0AIAQgAyABIAUQAkEAQQAoArAKQX5qNgKwCg8LIAQgA0EAQQAQAkEAIARBDGo2ArAKDwsQJQuFDAEKf0EAQQAoArAKIgBBDGoiATYCsApBARApIQJBACgCsAohAwJAAkACQAJAAkACQAJAAkAgAkEuRw0AQQAgA0ECajYCsAoCQEEBECkiAkHkAEYNAAJAIAJB8wBGDQAgAkHtAEcNB0EAKAKwCiICQQJqQZwIQQYQLw0HAkBBACgCnAoiAxAqDQAgAy8BAEEuRg0ICyAAIAAgAkEIakEAKALUCRABDwtBACgCsAoiAkECakGiCEEKEC8NBgJAQQAoApwKIgMQKg0AIAMvAQBBLkYNBwtBACEEQQAgAkEMajYCsApBASEFQQUhBkEBECkhAkEAIQdBASEIDAILQQAoArAKIgIpAAJC5YCYg9CMgDlSDQUCQEEAKAKcCiIDECoNACADLwEAQS5GDQYLQQAhBEEAIAJBCmo2ArAKQQIhCEEHIQZBASEHQQEQKSECQQEhBQwBCwJAAkACQAJAIAJB8wBHDQAgAyABTQ0AIANBAmpBoghBChAvDQACQCADLwEMIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAgsgBEGgAUYNAQtBACEHQQchBkEBIQQgAkHkAEYNAQwCC0EAIQRBACADQQxqIgI2ArAKQQEhBUEBECkhCQJAQQAoArAKIgYgAkYNAEHmACECAkAgCUHmAEYNAEEFIQZBACEHQQEhCCAJIQIMBAtBACEHQQEhCCAGQQJqQawIQQYQLw0EIAYvAQgQIEUNBAtBACEHQQAgAzYCsApBByEGQQEhBEEAIQVBACEIIAkhAgwCCyADIABBCmpNDQBBACEIQeQAIQICQCADKQACQuWAmIPQjIA5Ug0AAkACQCADLwEKIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAQtBACEIIARBoAFHDQELQQAhBUEAIANBCmo2ArAKQSohAkEBIQdBAiEIQQEQKSIJQSpGDQRBACADNgKwCkEBIQRBACEHQQAhCCAJIQIMAgsgAyEGQQAhBwwCC0EAIQVBACEICwJAIAJBKEcNAEEAKAKkCkEALwGYCiICQQN0aiIDQQAoArAKNgIEQQAgAkEBajsBmAogA0EFNgIAQQAoApwKLwEAQS5GDQRBAEEAKAKwCiIDQQJqNgKwCkEBECkhAiAAQQAoArAKQQAgAxABAkACQCAFDQBBACgC8AkhAQwBC0EAKALwCSIBIAY2AhwLQQBBAC8BlgoiA0EBajsBlgpBACgCqAogA0ECdGogATYCAAJAIAJBIkYNACACQSdGDQBBAEEAKAKwCkF+ajYCsAoPCyACEBpBAEEAKAKwCkECaiICNgKwCgJAAkACQEEBEClBV2oOBAECAgACC0EAQQAoArAKQQJqNgKwCkEBECkaQQAoAvAJIgMgAjYCBCADQQE6ABggA0EAKAKwCiICNgIQQQAgAkF+ajYCsAoPC0EAKALwCSIDIAI2AgQgA0EBOgAYQQBBAC8BmApBf2o7AZgKIANBACgCsApBAmo2AgxBAEEALwGWCkF/ajsBlgoPC0EAQQAoArAKQX5qNgKwCg8LAkAgBEEBcyACQfsAR3INAEEAKAKwCiECQQAvAZgKDQUDQAJAAkACQCACQQAoArQKTw0AQQEQKSICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKwCkECajYCsAoLQQEQKSEDQQAoArAKIQICQCADQeYARw0AIAJBAmpBrAhBBhAvDQcLQQAgAkEIajYCsAoCQEEBECkiAkEiRg0AIAJBJ0cNBwsgACACQQAQKw8LIAIQGgtBAEEAKAKwCkECaiICNgKwCgwACwsCQAJAIAJBWWoOBAMBAQMACyACQSJGDQILQQAoArAKIQYLIAYgAUcNAEEAIABBCmo2ArAKDwsgAkEqRyAHcQ0DQQAvAZgKQf//A3ENA0EAKAKwCiECQQAoArQKIQEDQCACIAFPDQECQAJAIAIvAQAiA0EnRg0AIANBIkcNAQsgACADIAgQKw8LQQAgAkECaiICNgKwCgwACwsQJQsPC0EAIAJBfmo2ArAKDwtBAEEAKAKwCkF+ajYCsAoLRwEDf0EAKAKwCkECaiEAQQAoArQKIQECQANAIAAiAkF+aiABTw0BIAJBAmohACACLwEAQXZqDgQBAAABAAsLQQAgAjYCsAoLmAEBA39BAEEAKAKwCiIBQQJqNgKwCiABQQZqIQFBACgCtAohAgNAAkACQAJAIAFBfGogAk8NACABQX5qLwEAIQMCQAJAIAANACADQSpGDQEgA0F2ag4EAgQEAgQLIANBKkcNAwsgAS8BAEEvRw0CQQAgAUF+ajYCsAoMAQsgAUF+aiEBC0EAIAE2ArAKDwsgAUECaiEBDAALC4gBAQR/QQAoArAKIQFBACgCtAohAgJAAkADQCABIgNBAmohASADIAJPDQEgAS8BACIEIABGDQICQCAEQdwARg0AIARBdmoOBAIBAQIBCyADQQRqIQEgAy8BBEENRw0AIANBBmogASADLwEGQQpGGyEBDAALC0EAIAE2ArAKECUPC0EAIAE2ArAKC2wBAX8CQAJAIABBX2oiAUEFSw0AQQEgAXRBMXENAQsgAEFGakH//wNxQQZJDQAgAEEpRyAAQVhqQf//A3FBB0lxDQACQCAAQaV/ag4EAQAAAQALIABB/QBHIABBhX9qQf//A3FBBElxDwtBAQsuAQF/QQEhAQJAIABBpglBBRAdDQAgAEGWCEEDEB0NACAAQbAJQQIQHSEBCyABC0YBA39BACEDAkAgACACQQF0IgJrIgRBAmoiAEEAKALcCSIFSQ0AIAAgASACEC8NAAJAIAAgBUcNAEEBDwsgBBAmIQMLIAMLgwEBAn9BASEBAkACQAJAAkACQAJAIAAvAQAiAkFFag4EBQQEAQALAkAgAkGbf2oOBAMEBAIACyACQSlGDQQgAkH5AEcNAyAAQX5qQbwJQQYQHQ8LIABBfmovAQBBPUYPCyAAQX5qQbQJQQQQHQ8LIABBfmpByAlBAxAdDwtBACEBCyABC7QDAQJ/QQAhAQJAAkACQAJAAkACQAJAAkACQAJAIAAvAQBBnH9qDhQAAQIJCQkJAwkJBAUJCQYJBwkJCAkLAkACQCAAQX5qLwEAQZd/ag4EAAoKAQoLIABBfGpByghBAhAdDwsgAEF8akHOCEEDEB0PCwJAAkACQCAAQX5qLwEAQY1/ag4DAAECCgsCQCAAQXxqLwEAIgJB4QBGDQAgAkHsAEcNCiAAQXpqQeUAECcPCyAAQXpqQeMAECcPCyAAQXxqQdQIQQQQHQ8LIABBfGpB3AhBBhAdDwsgAEF+ai8BAEHvAEcNBiAAQXxqLwEAQeUARw0GAkAgAEF6ai8BACICQfAARg0AIAJB4wBHDQcgAEF4akHoCEEGEB0PCyAAQXhqQfQIQQIQHQ8LIABBfmpB+AhBBBAdDwtBASEBIABBfmoiAEHpABAnDQQgAEGACUEFEB0PCyAAQX5qQeQAECcPCyAAQX5qQYoJQQcQHQ8LIABBfmpBmAlBBBAdDwsCQCAAQX5qLwEAIgJB7wBGDQAgAkHlAEcNASAAQXxqQe4AECcPCyAAQXxqQaAJQQMQHSEBCyABCzQBAX9BASEBAkAgAEF3akH//wNxQQVJDQAgAEGAAXJBoAFGDQAgAEEuRyAAEChxIQELIAELMAEBfwJAAkAgAEF3aiIBQRdLDQBBASABdEGNgIAEcQ0BCyAAQaABRg0AQQAPC0EBC04BAn9BACEBAkACQCAALwEAIgJB5QBGDQAgAkHrAEcNASAAQX5qQfgIQQQQHQ8LIABBfmovAQBB9QBHDQAgAEF8akHcCEEGEB0hAQsgAQveAQEEf0EAKAKwCiEAQQAoArQKIQECQAJAAkADQCAAIgJBAmohACACIAFPDQECQAJAAkAgAC8BACIDQaR/ag4FAgMDAwEACyADQSRHDQIgAi8BBEH7AEcNAkEAIAJBBGoiADYCsApBAEEALwGYCiICQQFqOwGYCkEAKAKkCiACQQN0aiICQQQ2AgAgAiAANgIEDwtBACAANgKwCkEAQQAvAZgKQX9qIgA7AZgKQQAoAqQKIABB//8DcUEDdGooAgBBA0cNAwwECyACQQRqIQAMAAsLQQAgADYCsAoLECULC3ABAn8CQAJAA0BBAEEAKAKwCiIAQQJqIgE2ArAKIABBACgCtApPDQECQAJAAkAgAS8BACIBQaV/ag4CAQIACwJAIAFBdmoOBAQDAwQACyABQS9HDQIMBAsQLhoMAQtBACAAQQRqNgKwCgwACwsQJQsLNQEBf0EAQQE6APwJQQAoArAKIQBBAEEAKAK0CkECajYCsApBACAAQQAoAtwJa0EBdTYCkAoLQwECf0EBIQECQCAALwEAIgJBd2pB//8DcUEFSQ0AIAJBgAFyQaABRg0AQQAhASACEChFDQAgAkEuRyAAECpyDwsgAQs9AQJ/QQAhAgJAQQAoAtwJIgMgAEsNACAALwEAIAFHDQACQCADIABHDQBBAQ8LIABBfmovAQAQICECCyACC2gBAn9BASEBAkACQCAAQV9qIgJBBUsNAEEBIAJ0QTFxDQELIABB+P8DcUEoRg0AIABBRmpB//8DcUEGSQ0AAkAgAEGlf2oiAkEDSw0AIAJBAUcNAQsgAEGFf2pB//8DcUEESSEBCyABC5wBAQN/QQAoArAKIQECQANAAkACQCABLwEAIgJBL0cNAAJAIAEvAQIiAUEqRg0AIAFBL0cNBBAYDAILIAAQGQwBCwJAAkAgAEUNACACQXdqIgFBF0sNAUEBIAF0QZ+AgARxRQ0BDAILIAIQIUUNAwwBCyACQaABRw0CC0EAQQAoArAKIgNBAmoiATYCsAogA0EAKAK0CkkNAAsLIAILMQEBf0EAIQECQCAALwEAQS5HDQAgAEF+ai8BAEEuRw0AIABBfGovAQBBLkYhAQsgAQumBAEBfwJAIAFBIkYNACABQSdGDQAQJQ8LQQAoArAKIQMgARAaIAAgA0ECakEAKAKwCkEAKALQCRABAkAgAkEBSA0AQQAoAvAJQQRBBiACQQFGGzYCHAtBAEEAKAKwCkECajYCsAoCQAJAAkACQEEAECkiAUHhAEYNACABQfcARg0BQQAoArAKIQEMAgtBACgCsAoiAUECakHACEEKEC8NAUEGIQIMAgtBACgCsAoiAS8BAkHpAEcNACABLwEEQfQARw0AQQQhAiABLwEGQegARg0BC0EAIAFBfmo2ArAKDwtBACABIAJBAXRqNgKwCgJAQQEQKUH7AEYNAEEAIAE2ArAKDwtBACgCsAoiACECA0BBACACQQJqNgKwCgJAAkACQEEBECkiAkEiRg0AIAJBJ0cNAUEnEBpBAEEAKAKwCkECajYCsApBARApIQIMAgtBIhAaQQBBACgCsApBAmo2ArAKQQEQKSECDAELIAIQLCECCwJAIAJBOkYNAEEAIAE2ArAKDwtBAEEAKAKwCkECajYCsAoCQEEBECkiAkEiRg0AIAJBJ0YNAEEAIAE2ArAKDwsgAhAaQQBBACgCsApBAmo2ArAKAkACQEEBECkiAkEsRg0AIAJB/QBGDQFBACABNgKwCg8LQQBBACgCsApBAmo2ArAKQQEQKUH9AEYNAEEAKAKwCiECDAELC0EAKALwCSIBIAA2AhAgAUEAKAKwCkECajYCDAttAQJ/AkACQANAAkAgAEH//wNxIgFBd2oiAkEXSw0AQQEgAnRBn4CABHENAgsgAUGgAUYNASAAIQIgARAoDQJBACECQQBBACgCsAoiAEECajYCsAogAC8BAiIADQAMAgsLIAAhAgsgAkH//wNxC6sBAQR/AkACQEEAKAKwCiICLwEAIgNB4QBGDQAgASEEIAAhBQwBC0EAIAJBBGo2ArAKQQEQKSECQQAoArAKIQUCQAJAIAJBIkYNACACQSdGDQAgAhAsGkEAKAKwCiEEDAELIAIQGkEAQQAoArAKQQJqIgQ2ArAKC0EBECkhA0EAKAKwCiECCwJAIAIgBUYNACAFIARBACAAIAAgAUYiAhtBACABIAIbEAILIAMLcgEEf0EAKAKwCiEAQQAoArQKIQECQAJAA0AgAEECaiECIAAgAU8NAQJAAkAgAi8BACIDQaR/ag4CAQQACyACIQAgA0F2ag4EAgEBAgELIABBBGohAAwACwtBACACNgKwChAlQQAPC0EAIAI2ArAKQd0AC0kBA39BACEDAkAgAkUNAAJAA0AgAC0AACIEIAEtAAAiBUcNASABQQFqIQEgAEEBaiEAIAJBf2oiAg0ADAILCyAEIAVrIQMLIAMLC+wBAgBBgAgLzgEAAHgAcABvAHIAdABtAHAAbwByAHQAZgBvAHIAZQB0AGEAbwB1AHIAYwBlAHIAbwBtAHUAbgBjAHQAaQBvAG4AcwBzAGUAcgB0AHYAbwB5AGkAZQBkAGUAbABlAGMAbwBuAHQAaQBuAGkAbgBzAHQAYQBuAHQAeQBiAHIAZQBhAHIAZQB0AHUAcgBkAGUAYgB1AGcAZwBlAGEAdwBhAGkAdABoAHIAdwBoAGkAbABlAGkAZgBjAGEAdABjAGYAaQBuAGEAbABsAGUAbABzAABB0AkLEAEAAAACAAAAAAQAAEA5AAA=", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), ((A2) => A2.charCodeAt(0)));
      var A;
    }, "E");
    WebAssembly.compile(E()).then(WebAssembly.instantiate).then((({ exports: A }) => {
    }));
    __name(template, "template");
    DEFAULT_404_ROUTE = {
      component: DEFAULT_404_COMPONENT,
      generate: /* @__PURE__ */ __name(() => "", "generate"),
      params: [],
      pattern: /^\/404\/?$/,
      prerender: false,
      pathname: "/404",
      segments: [[{ content: "404", dynamic: false, spread: false }]],
      type: "page",
      route: "/404",
      fallbackRoutes: [],
      isIndex: false,
      origin: "internal"
    };
    __name(ensure404Route, "ensure404Route");
    __name(default404Page, "default404Page");
    default404Page.isAstroComponentFactory = true;
    default404Instance = {
      default: default404Page
    };
  }
});

// dist/_worker.js/chunks/render-context_Dfpkc5S_.mjs
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function isInternalPath(path) {
  return INTERNAL_PREFIXES.has(path.slice(0, 2)) && !JUST_SLASHES.test(path);
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i2) => {
    if (i2 === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i2 === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function hasFileExtension(path) {
  return WITH_FILE_EXT.test(path);
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return redirect.startsWith("http://") || redirect.startsWith("https://");
  } else {
    return redirect.destination.startsWith("http://") || redirect.destination.startsWith("https://");
  }
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
  const headers = { location: encodeURI(redirectRouteGenerate(renderContext)) };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
function redirectRouteGenerate(renderContext) {
  const {
    params,
    routeData: { redirect, redirectRoute }
  } = renderContext;
  if (typeof redirectRoute !== "undefined") {
    return redirectRoute?.generate(params) || redirectRoute?.pathname || "/";
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
async function getRequestData(request) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const raw = await request.text();
        const data = JSON.parse(raw);
        if ("slots" in data && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if ("componentExport" in data && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e2) {
        if (e2 instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e2;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page = /* @__PURE__ */ __name(async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request);
    if (data instanceof Response) {
      return data;
    }
    const imp = manifest2.serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    let componentExport;
    try {
      componentExport = await decryptString(key, data.encryptedComponentExport);
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = /* @__PURE__ */ __name(function(...args) {
        return ServerIsland.apply(this, args);
      }, "Component");
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  }, "page");
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}
function matchRoute(pathname, manifest2) {
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404(route) {
  return ROUTE404_RE.test(route);
}
function isRoute500(route) {
  return ROUTE500_RE.test(route);
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function isRequestServerIsland(request, base = "") {
  const url = new URL(request.url);
  const pathname = base === "/" ? url.pathname.slice(base.length) : url.pathname.slice(base.length + 1);
  return pathname.startsWith(SERVER_ISLAND_BASE_PREFIX);
}
function requestIs404Or500(request, base = "") {
  const url = new URL(request.url);
  const pathname = url.pathname.slice(base.length);
  return isRoute404(pathname) || isRoute500(pathname);
}
function isRouteExternalRedirect(route) {
  return !!(route.type === "redirect" && route.redirect && redirectIsExternal(route.redirect));
}
function requestHasLocale(locales) {
  return function(context) {
    return pathHasLocale(context.url.pathname, locales);
  };
}
function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}
function redirectToDefaultLocale({
  trailingSlash,
  format,
  base,
  defaultLocale
}) {
  return function(context, statusCode) {
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return context.redirect(`${appendForwardSlash(joinPaths(base, defaultLocale))}`, statusCode);
    } else {
      return context.redirect(`${joinPaths(base, defaultLocale)}`, statusCode);
    }
  };
}
function notFound({ base, locales, fallback }) {
  return function(context, response) {
    if (response?.headers.get(REROUTE_DIRECTIVE_HEADER) === "no" && typeof fallback === "undefined") {
      return response;
    }
    const url = context.url;
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathHasLocale(url.pathname, locales))) {
      if (response) {
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        return new Response(response.body, {
          status: 404,
          headers: response.headers
        });
      } else {
        return new Response(null, {
          status: 404,
          headers: {
            [REROUTE_DIRECTIVE_HEADER]: "no"
          }
        });
      }
    }
    return void 0;
  };
}
function redirectToFallback({
  fallback,
  locales,
  defaultLocale,
  strategy,
  base,
  fallbackType
}) {
  return async function(context, response) {
    if (response.status >= 300 && fallback) {
      const fallbackKeys = fallback ? Object.keys(fallback) : [];
      const segments = context.url.pathname.split("/");
      const urlLocale = segments.find((segment) => {
        for (const locale of locales) {
          if (typeof locale === "string") {
            if (locale === segment) {
              return true;
            }
          } else if (locale.path === segment) {
            return true;
          }
        }
        return false;
      });
      if (urlLocale && fallbackKeys.includes(urlLocale)) {
        const fallbackLocale = fallback[urlLocale];
        const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
        let newPathname;
        if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
          if (context.url.pathname.includes(`${base}`)) {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, ``);
            if (newPathname === "") {
              newPathname = "/";
            }
          } else {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, `/`);
          }
        } else {
          newPathname = context.url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
        }
        if (fallbackType === "rewrite") {
          return await context.rewrite(newPathname + context.url.search);
        } else {
          return context.redirect(newPathname + context.url.search);
        }
      }
    }
    return response;
  };
}
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parseCookie = parseCookie;
  dist.parse = parseCookie;
  dist.stringifyCookie = stringifyCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  dist.parseSetCookie = parseSetCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const maxAgeRegExp = /^-?\d+$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C = /* @__PURE__ */ __name(function() {
    }, "C");
    C.prototype = /* @__PURE__ */ Object.create(null);
    return C;
  })();
  function parseCookie(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
      const eqIdx = eqIndex(str, index, len);
      if (eqIdx === -1)
        break;
      const endIdx = endIndex(str, index, len);
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const key = valueSlice(str, index, eqIdx);
      if (obj[key] === void 0) {
        obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  __name(parseCookie, "parseCookie");
  function stringifyCookie(cookie, options) {
    const enc = options?.encode || encodeURIComponent;
    const cookieStrings = [];
    for (const name of Object.keys(cookie)) {
      const val = cookie[name];
      if (val === void 0)
        continue;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`cookie name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`cookie val is invalid: ${val}`);
      }
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join("; ");
  }
  __name(stringifyCookie, "stringifyCookie");
  function stringifySetCookie(_name, _val, _opts) {
    const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
    const options = typeof _val === "object" ? _val : _opts;
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(cookie.name)) {
      throw new TypeError(`argument name is invalid: ${cookie.name}`);
    }
    const value = cookie.value ? enc(cookie.value) : "";
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${cookie.value}`);
    }
    let str = cookie.name + "=" + value;
    if (cookie.maxAge !== void 0) {
      if (!Number.isInteger(cookie.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
      }
      str += "; Max-Age=" + cookie.maxAge;
    }
    if (cookie.domain) {
      if (!domainValueRegExp.test(cookie.domain)) {
        throw new TypeError(`option domain is invalid: ${cookie.domain}`);
      }
      str += "; Domain=" + cookie.domain;
    }
    if (cookie.path) {
      if (!pathValueRegExp.test(cookie.path)) {
        throw new TypeError(`option path is invalid: ${cookie.path}`);
      }
      str += "; Path=" + cookie.path;
    }
    if (cookie.expires) {
      if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${cookie.expires}`);
      }
      str += "; Expires=" + cookie.expires.toUTCString();
    }
    if (cookie.httpOnly) {
      str += "; HttpOnly";
    }
    if (cookie.secure) {
      str += "; Secure";
    }
    if (cookie.partitioned) {
      str += "; Partitioned";
    }
    if (cookie.priority) {
      const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${cookie.priority}`);
      }
    }
    if (cookie.sameSite) {
      const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
      }
    }
    return str;
  }
  __name(stringifySetCookie, "stringifySetCookie");
  function parseSetCookie(str, options) {
    const dec = options?.decode || decode;
    const len = str.length;
    const endIdx = endIndex(str, 0, len);
    const eqIdx = eqIndex(str, 0, endIdx);
    const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
      name: valueSlice(str, 0, eqIdx),
      value: dec(valueSlice(str, eqIdx + 1, endIdx))
    };
    let index = endIdx + 1;
    while (index < len) {
      const endIdx2 = endIndex(str, index, len);
      const eqIdx2 = eqIndex(str, index, endIdx2);
      const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
      const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
      switch (attr.toLowerCase()) {
        case "httponly":
          setCookie.httpOnly = true;
          break;
        case "secure":
          setCookie.secure = true;
          break;
        case "partitioned":
          setCookie.partitioned = true;
          break;
        case "domain":
          setCookie.domain = val;
          break;
        case "path":
          setCookie.path = val;
          break;
        case "max-age":
          if (val && maxAgeRegExp.test(val))
            setCookie.maxAge = Number(val);
          break;
        case "expires":
          if (!val)
            break;
          const date = new Date(val);
          if (Number.isFinite(date.valueOf()))
            setCookie.expires = date;
          break;
        case "priority":
          if (!val)
            break;
          const priority = val.toLowerCase();
          if (priority === "low" || priority === "medium" || priority === "high") {
            setCookie.priority = priority;
          }
          break;
        case "samesite":
          if (!val)
            break;
          const sameSite = val.toLowerCase();
          if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
            setCookie.sameSite = sameSite;
          }
          break;
      }
      index = endIdx2 + 1;
    }
    return setCookie;
  }
  __name(parseSetCookie, "parseSetCookie");
  function endIndex(str, min, len) {
    const index = str.indexOf(";", min);
    return index === -1 ? len : index;
  }
  __name(endIndex, "endIndex");
  function eqIndex(str, min, max) {
    const index = str.indexOf("=", min);
    return index < max ? index : -1;
  }
  __name(eqIndex, "eqIndex");
  function valueSlice(str, min, max) {
    let start = min;
    let end = max;
    do {
      const code = str.charCodeAt(start);
      if (code !== 32 && code !== 9)
        break;
    } while (++start < end);
    while (end > start) {
      const code = str.charCodeAt(end - 1);
      if (code !== 32 && code !== 9)
        break;
      end--;
    }
    return str.slice(start, end);
  }
  __name(valueSlice, "valueSlice");
  function decode(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e2) {
      return str;
    }
  }
  __name(decode, "decode");
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  __name(isDate, "isDate");
  return dist;
}
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t2) => type === t2);
}
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: /* @__PURE__ */ __name(async () => {
        const pipeline = Reflect.get(context, apiContextRoutesSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error2) {
          if (error2 instanceof Error && "name" in error2 && typeof error2.name === "string" && error2.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error2;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e2) {
          if (e2 instanceof ActionError) {
            return { data: void 0, error: e2 };
          }
          if (e2 instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e2;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }, "handler")
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  __name(setActionResult, "setActionResult");
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  if (hasContentType(contentType, formContentTypes)) {
    if (!hasContentLength) {
      const body = await readRequestBodyWithLimit(request.clone(), bodySizeLimit);
      const formRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: toArrayBuffer(body)
      });
      return await formRequest.formData();
    }
    return await request.clone().formData();
  }
  if (hasContentType(contentType, ["application/json"])) {
    if (contentLength === 0) return void 0;
    if (!hasContentLength) {
      const body = await readRequestBodyWithLimit(request.clone(), bodySizeLimit);
      if (body.byteLength === 0) return void 0;
      return JSON.parse(new TextDecoder().decode(body));
    }
    return await request.clone().json();
  }
  throw new TypeError("Unsupported content type");
}
async function readRequestBodyWithLimit(request, limit) {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new ActionError({
          code: "CONTENT_TOO_LARGE",
          message: `Request body exceeds ${limit} bytes`
        });
      }
      chunks.push(value);
    }
  }
  const buffer2 = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer2.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer2;
}
function toArrayBuffer(buffer2) {
  const copy = new Uint8Array(buffer2.byteLength);
  copy.set(buffer2);
  return copy.buffer;
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
function parseLocale(header2) {
  if (header2 === "*") {
    return [{ locale: header2, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header2.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a2, b) => {
    if (a2.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a2.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  let deduplicated = false;
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  for (const directive of directives) {
    if (deduplicated) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      deduplicated = true;
    } else {
      finalDirectives.push(directive);
      finalDirectives.push(newDirective);
    }
  }
  return finalDirectives;
}
async function callMiddleware(onRequest2, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = /* @__PURE__ */ __name(async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  }, "next");
  let middlewarePromise = onRequest2(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
function createRequest({
  url,
  headers,
  method = "GET",
  body = void 0,
  logger,
  isPrerendered = false,
  routePattern,
  init
}) {
  const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(
    // Filter out HTTP/2 pseudo-headers. These are internally-generated headers added to all HTTP/2 requests with trusted metadata about the request.
    // Examples include `:method`, `:scheme`, `:authority`, and `:path`.
    // They are always prefixed with a colon to distinguish them from other headers, and it is an error to add the to a Headers object manually.
    // See https://httpwg.org/specs/rfc7540.html#HttpRequest
    Object.entries(headers).filter(([name]) => !name.startsWith(":"))
  );
  if (typeof url === "string") url = new URL(url);
  if (isPrerendered) {
    url.search = "";
  }
  const request = new Request(url, {
    method,
    headers: headersObj,
    // body is made available only if the request is for a page that will be on-demand rendered
    body: isPrerendered ? null : body,
    ...init
  });
  if (isPrerendered) {
    let _headers = request.headers;
    const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
    Object.defineProperty(request, "headers", {
      ...headersDesc,
      get() {
        logger.warn(
          null,
          `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`
        );
        return _headers;
      },
      set(newHeaders) {
        _headers = newHeaders;
      }
    });
  }
  return request;
}
function findRouteToRewrite({
  payload,
  routes: routes2,
  request,
  trailingSlash,
  buildFormat,
  base,
  outDir
}) {
  let newUrl = void 0;
  if (payload instanceof URL) {
    newUrl = payload;
  } else if (payload instanceof Request) {
    newUrl = new URL(payload.url);
  } else {
    newUrl = new URL(payload, new URL(request.url).origin);
  }
  let pathname = newUrl.pathname;
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  if (base !== "/") {
    const isBasePathRequest = newUrl.pathname === base || newUrl.pathname === removeTrailingForwardSlash(base);
    if (isBasePathRequest) {
      pathname = shouldAppendSlash ? "/" : "";
    } else if (newUrl.pathname.startsWith(base)) {
      pathname = shouldAppendSlash ? appendForwardSlash(newUrl.pathname) : removeTrailingForwardSlash(newUrl.pathname);
      pathname = pathname.slice(base.length);
    }
  }
  if (!pathname.startsWith("/") && shouldAppendSlash && newUrl.pathname.endsWith("/")) {
    pathname = prependForwardSlash(pathname);
  }
  if (pathname === "/" && base !== "/" && !shouldAppendSlash) {
    pathname = "";
  }
  if (buildFormat === "file") {
    pathname = pathname.replace(/\.html$/, "");
  }
  if (base !== "/" && (pathname === "" || pathname === "/") && !shouldAppendSlash) {
    newUrl.pathname = removeTrailingForwardSlash(base);
  } else {
    newUrl.pathname = joinPaths(...[base, pathname].filter(Boolean));
  }
  const decodedPathname = decodeURI(pathname);
  let foundRoute;
  for (const route of routes2) {
    if (route.pattern.test(decodedPathname)) {
      if (route.params && route.params.length !== 0 && route.distURL && route.distURL.length !== 0) {
        if (!route.distURL.find(
          (url) => url.href.replace(outDir.toString(), "").replace(/(?:\/index\.html|\.html)$/, "") == trimSlashes(decodedPathname)
        )) {
          continue;
        }
      }
      foundRoute = route;
      break;
    }
  }
  if (foundRoute) {
    return {
      routeData: foundRoute,
      newUrl,
      pathname: decodedPathname
    };
  } else {
    const custom404 = routes2.find((route) => route.route === "/404");
    if (custom404) {
      return { routeData: custom404, newUrl, pathname };
    } else {
      return { routeData: DEFAULT_404_ROUTE, newUrl, pathname };
    }
  }
}
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
  if (oldRequest.bodyUsed) {
    throw new AstroError(RewriteWithBodyUsed);
  }
  return createRequest({
    url: newUrl,
    method: oldRequest.method,
    body: oldRequest.body,
    isPrerendered,
    logger,
    headers: isPrerendered ? {} : oldRequest.headers,
    routePattern,
    init: {
      referrer: oldRequest.referrer,
      referrerPolicy: oldRequest.referrerPolicy,
      mode: oldRequest.mode,
      credentials: oldRequest.credentials,
      cache: oldRequest.cache,
      redirect: oldRequest.redirect,
      integrity: oldRequest.integrity,
      signal: oldRequest.signal,
      keepalive: oldRequest.keepalive,
      // https://fetch.spec.whatwg.org/#dom-request-duplex
      // @ts-expect-error It isn't part of the types, but undici accepts it and it allows to carry over the body to a new request
      duplex: "half"
    }
  });
}
function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
  if (!pathname) {
    pathname = "/";
  }
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  let finalPathname;
  if (pathname === "/") {
    finalPathname = "/";
  } else if (shouldAppendSlash) {
    finalPathname = appendForwardSlash(pathname);
  } else {
    finalPathname = removeTrailingForwardSlash(pathname);
  }
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}
function getOriginPathname(request) {
  const origin = Reflect.get(request, originPathnameSymbol);
  if (origin) {
    return decodeURIComponent(origin);
  }
  return new URL(request.url).pathname;
}
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return route.generate(validatedParams);
}
function generatePaginateFunction(routeMatch, base) {
  return /* @__PURE__ */ __name(function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = addRouteBase(routeMatch.generate({ ...params }), base);
      const next = pageNum === lastPage ? void 0 : addRouteBase(routeMatch.generate({ ...params, page: String(pageNum + 1) }), base);
      const prev = pageNum === 1 ? void 0 : addRouteBase(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        }),
        base
      );
      const first = pageNum === 1 ? void 0 : addRouteBase(
        routeMatch.generate({
          ...params,
          page: includesFirstPageNumber ? "1" : void 0
        }),
        base
      );
      const last = pageNum === lastPage ? void 0 : addRouteBase(routeMatch.generate({ ...params, page: String(lastPage) }), base);
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev, first, last }
          }
        }
      };
    });
    return result;
  }, "paginateUtility");
}
function addRouteBase(route, base) {
  let routeWithBase = joinPaths(base, route);
  if (routeWithBase === "") routeWithBase = "/";
  return routeWithBase;
}
async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr,
  base
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route, base),
    routePattern: route.route
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
async function getProps(opts) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike, base } = opts;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr: serverLike,
    base
  });
  const params = getParams(route, pathname);
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(pathname) || route.fallbackRoutes.map((fallbackRoute) => fallbackRoute.pattern.exec(pathname)).find((x) => x);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i2) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i2 + 1] ? paramsMatch[i2 + 1] : void 0;
    } else {
      params[key] = paramsMatch[i2 + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e2) => isRenderInstruction(e2) === false);
  if (expressions?.length !== 1) return;
  return expressions[0];
}
function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i2, handleContext) {
      const handle2 = filtered[i2];
      const result = handle2(handleContext, async (payload) => {
        if (i2 < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request.clone());
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request.clone()
              );
            }
            const oldPathname = handleContext.url.pathname;
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.params = getParams(routeData, pathname);
            handleContext.routePattern = routeData.route;
            setOriginPathname(
              handleContext.request,
              oldPathname,
              pipeline.manifest.trailingSlash,
              pipeline.manifest.buildFormat
            );
          }
          return applyHandle(i2 + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
    __name(applyHandle, "applyHandle");
  });
}
function defineMiddleware(fn) {
  return fn;
}
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}
function defineDriver(factory) {
  return factory;
}
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = /* @__PURE__ */ __name((key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  }, "getMount");
  const getMounts = /* @__PURE__ */ __name((base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  }, "getMounts");
  const onChange = /* @__PURE__ */ __name((event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  }, "onChange");
  const startWatch = /* @__PURE__ */ __name(async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  }, "startWatch");
  const stopWatch = /* @__PURE__ */ __name(async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  }, "stopWatch");
  const runBatch = /* @__PURE__ */ __name((items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = /* @__PURE__ */ __name((mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    }, "getBatch");
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r2) => r2.flat()
    );
  }, "runBatch");
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r2) => r2.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta2 = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta2, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta2, value);
        }
      }
      return meta2;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a2, b) => b.length - a2.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: /* @__PURE__ */ __name((base, opts = {}) => storage.getKeys(base, opts), "keys"),
    get: /* @__PURE__ */ __name((key, opts = {}) => storage.getItem(key, opts), "get"),
    set: /* @__PURE__ */ __name((key, value, opts = {}) => storage.setItem(key, value, opts), "set"),
    has: /* @__PURE__ */ __name((key, opts = {}) => storage.hasItem(key, opts), "has"),
    del: /* @__PURE__ */ __name((key, opts = {}) => storage.removeItem(key, opts), "del"),
    remove: /* @__PURE__ */ __name((key, opts = {}) => storage.removeItem(key, opts), "remove")
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
function resolveSessionDriverName(driver) {
  if (!driver) {
    return null;
  }
  try {
    if (driver === "fs") {
      return builtinDrivers.fsLite;
    }
    if (driver in builtinDrivers) {
      return builtinDrivers[driver];
    }
  } catch {
    return null;
  }
  return driver;
}
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  const hasDecoding = decoded !== pathname;
  const decodedStillHasEncoding = /%[0-9a-fA-F]{2}/.test(decoded);
  if (hasDecoding && decodedStillHasEncoding) {
    throw new Error("Multi-level URL encoding is not allowed");
  }
  return decoded;
}
var MANY_TRAILING_SLASHES, INTERNAL_PREFIXES, JUST_SLASHES, WITH_FILE_EXT, SERVER_ISLAND_ROUTE, SERVER_ISLAND_COMPONENT, SERVER_ISLAND_BASE_PREFIX, ROUTE404_RE, ROUTE500_RE, dist, hasRequiredDist, distExports, DELETED_EXPIRATION, DELETED_VALUE, responseSentSymbol2, identity, AstroCookie, AstroCookies, astroCookiesSymbol, ACTION_API_CONTEXT_SYMBOL, formContentTypes, VALID_PARAM_TYPES, RouteCache, Slots, suspectProtoRx, suspectConstructorRx, JsonSigRx, BASE64_PREFIX, DRIVER_NAME, memory, builtinDrivers, PERSIST_SYMBOL, DEFAULT_COOKIE_NAME, VALID_COOKIE_REGEX, unflatten2, stringify2, AstroSession, apiContextRoutesSymbol, RenderContext;
var init_render_context_Dfpkc5S = __esm({
  "dist/_worker.js/chunks/render-context_Dfpkc5S_.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_CG2QLMoV();
    init_astro_designed_error_pages_qRxMrroR();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(appendForwardSlash, "appendForwardSlash");
    __name(prependForwardSlash, "prependForwardSlash");
    MANY_TRAILING_SLASHES = /\/{2,}$/g;
    __name(collapseDuplicateTrailingSlashes, "collapseDuplicateTrailingSlashes");
    __name(removeTrailingForwardSlash, "removeTrailingForwardSlash");
    __name(removeLeadingForwardSlash, "removeLeadingForwardSlash");
    __name(trimSlashes, "trimSlashes");
    __name(isString, "isString");
    INTERNAL_PREFIXES = /* @__PURE__ */ new Set(["/_", "/@", "/.", "//"]);
    JUST_SLASHES = /^\/{2,}$/;
    __name(isInternalPath, "isInternalPath");
    __name(joinPaths, "joinPaths");
    __name(slash, "slash");
    __name(fileExtension, "fileExtension");
    WITH_FILE_EXT = /\/[^/]+\.\w+$/;
    __name(hasFileExtension, "hasFileExtension");
    __name(shouldAppendForwardSlash, "shouldAppendForwardSlash");
    __name(redirectIsExternal, "redirectIsExternal");
    __name(renderRedirect, "renderRedirect");
    __name(redirectRouteGenerate, "redirectRouteGenerate");
    SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
    SERVER_ISLAND_COMPONENT = "_server-islands.astro";
    SERVER_ISLAND_BASE_PREFIX = "_server-islands";
    __name(badRequest, "badRequest");
    __name(getRequestData, "getRequestData");
    __name(createEndpoint, "createEndpoint");
    __name(matchRoute, "matchRoute");
    ROUTE404_RE = /^\/404\/?$/;
    ROUTE500_RE = /^\/500\/?$/;
    __name(isRoute404, "isRoute404");
    __name(isRoute500, "isRoute500");
    __name(isRoute404or500, "isRoute404or500");
    __name(isRouteServerIsland, "isRouteServerIsland");
    __name(isRequestServerIsland, "isRequestServerIsland");
    __name(requestIs404Or500, "requestIs404Or500");
    __name(isRouteExternalRedirect, "isRouteExternalRedirect");
    __name(requestHasLocale, "requestHasLocale");
    __name(pathHasLocale, "pathHasLocale");
    __name(getPathByLocale, "getPathByLocale");
    __name(normalizeTheLocale, "normalizeTheLocale");
    __name(normalizeThePath, "normalizeThePath");
    __name(getAllCodes, "getAllCodes");
    __name(redirectToDefaultLocale, "redirectToDefaultLocale");
    __name(notFound, "notFound");
    __name(redirectToFallback, "redirectToFallback");
    dist = {};
    __name(requireDist, "requireDist");
    distExports = /* @__PURE__ */ requireDist();
    DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
    DELETED_VALUE = "deleted";
    responseSentSymbol2 = /* @__PURE__ */ Symbol.for("astro.responseSent");
    identity = /* @__PURE__ */ __name((value) => value, "identity");
    AstroCookie = class {
      static {
        __name(this, "AstroCookie");
      }
      constructor(value) {
        this.value = value;
      }
      json() {
        if (this.value === void 0) {
          throw new Error(`Cannot convert undefined to an object.`);
        }
        return JSON.parse(this.value);
      }
      number() {
        return Number(this.value);
      }
      boolean() {
        if (this.value === "false") return false;
        if (this.value === "0") return false;
        return Boolean(this.value);
      }
    };
    AstroCookies = class {
      static {
        __name(this, "AstroCookies");
      }
      #request;
      #requestValues;
      #outgoing;
      #consumed;
      constructor(request) {
        this.#request = request;
        this.#requestValues = null;
        this.#outgoing = null;
        this.#consumed = false;
      }
      /**
       * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
       * in a Set-Cookie header added to the response.
       * @param key The cookie to delete
       * @param options Options related to this deletion, such as the path of the cookie.
       */
      delete(key, options) {
        const {
          // @ts-expect-error
          maxAge: _ignoredMaxAge,
          // @ts-expect-error
          expires: _ignoredExpires,
          ...sanitizedOptions
        } = options || {};
        const serializeOptions = {
          expires: DELETED_EXPIRATION,
          ...sanitizedOptions
        };
        this.#ensureOutgoingMap().set(key, [
          DELETED_VALUE,
          distExports.serialize(key, DELETED_VALUE, serializeOptions),
          false
        ]);
      }
      /**
       * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
       * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
       * from that set call, overriding any values already part of the request.
       * @param key The cookie to get.
       * @returns An object containing the cookie value as well as convenience methods for converting its value.
       */
      get(key, options = void 0) {
        if (this.#outgoing?.has(key)) {
          let [serializedValue, , isSetValue] = this.#outgoing.get(key);
          if (isSetValue) {
            return new AstroCookie(serializedValue);
          } else {
            return void 0;
          }
        }
        const decode = options?.decode ?? decodeURIComponent;
        const values = this.#ensureParsed();
        if (key in values) {
          const value = values[key];
          if (value) {
            let decodedValue;
            try {
              decodedValue = decode(value);
            } catch (_error) {
              decodedValue = value;
            }
            return new AstroCookie(decodedValue);
          }
        }
      }
      /**
       * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
       * part of the initial request or set via Astro.cookies.set(key)
       * @param key The cookie to check for.
       * @param _options This parameter is no longer used.
       * @returns
       */
      has(key, _options) {
        if (this.#outgoing?.has(key)) {
          let [, , isSetValue] = this.#outgoing.get(key);
          return isSetValue;
        }
        const values = this.#ensureParsed();
        return values[key] !== void 0;
      }
      /**
       * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
       * an object it will be stringified via JSON.stringify(value). Additionally you
       * can provide options customizing how this cookie will be set, such as setting httpOnly
       * in order to prevent the cookie from being read in client-side JavaScript.
       * @param key The name of the cookie to set.
       * @param value A value, either a string or other primitive or an object.
       * @param options Options for the cookie, such as the path and security settings.
       */
      set(key, value, options) {
        if (this.#consumed) {
          const warning = new Error(
            "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
          );
          warning.name = "Warning";
          console.warn(warning);
        }
        let serializedValue;
        if (typeof value === "string") {
          serializedValue = value;
        } else {
          let toStringValue = value.toString();
          if (toStringValue === Object.prototype.toString.call(value)) {
            serializedValue = JSON.stringify(value);
          } else {
            serializedValue = toStringValue;
          }
        }
        const serializeOptions = {};
        if (options) {
          Object.assign(serializeOptions, options);
        }
        this.#ensureOutgoingMap().set(key, [
          serializedValue,
          distExports.serialize(key, serializedValue, serializeOptions),
          true
        ]);
        if (this.#request[responseSentSymbol2]) {
          throw new AstroError({
            ...ResponseSentError
          });
        }
      }
      /**
       * Merges a new AstroCookies instance into the current instance. Any new cookies
       * will be added to the current instance, overwriting any existing cookies with the same name.
       */
      merge(cookies) {
        const outgoing = cookies.#outgoing;
        if (outgoing) {
          for (const [key, value] of outgoing) {
            this.#ensureOutgoingMap().set(key, value);
          }
        }
      }
      /**
       * Astro.cookies.header() returns an iterator for the cookies that have previously
       * been set by either Astro.cookies.set() or Astro.cookies.delete().
       * This method is primarily used by adapters to set the header on outgoing responses.
       * @returns
       */
      *headers() {
        if (this.#outgoing == null) return;
        for (const [, value] of this.#outgoing) {
          yield value[1];
        }
      }
      /**
       * Behaves the same as AstroCookies.prototype.headers(),
       * but allows a warning when cookies are set after the instance is consumed.
       */
      static consume(cookies) {
        cookies.#consumed = true;
        return cookies.headers();
      }
      #ensureParsed() {
        if (!this.#requestValues) {
          this.#parse();
        }
        if (!this.#requestValues) {
          this.#requestValues = {};
        }
        return this.#requestValues;
      }
      #ensureOutgoingMap() {
        if (!this.#outgoing) {
          this.#outgoing = /* @__PURE__ */ new Map();
        }
        return this.#outgoing;
      }
      #parse() {
        const raw = this.#request.headers.get("cookie");
        if (!raw) {
          return;
        }
        this.#requestValues = distExports.parse(raw, { decode: identity });
      }
    };
    astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
    __name(attachCookiesToResponse, "attachCookiesToResponse");
    __name(getCookiesFromResponse, "getCookiesFromResponse");
    __name(getSetCookiesFromResponse, "getSetCookiesFromResponse");
    ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
    formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
    __name(hasContentType, "hasContentType");
    __name(getActionContext, "getActionContext");
    __name(getCallerInfo, "getCallerInfo");
    __name(parseRequestBody, "parseRequestBody");
    __name(readRequestBodyWithLimit, "readRequestBodyWithLimit");
    __name(toArrayBuffer, "toArrayBuffer");
    __name(hasActionPayload, "hasActionPayload");
    __name(createGetActionResult, "createGetActionResult");
    __name(createCallAction, "createCallAction");
    __name(parseLocale, "parseLocale");
    __name(sortAndFilterLocales, "sortAndFilterLocales");
    __name(computePreferredLocale, "computePreferredLocale");
    __name(computePreferredLocaleList, "computePreferredLocaleList");
    __name(computeCurrentLocale, "computeCurrentLocale");
    __name(deduplicateDirectiveValues, "deduplicateDirectiveValues");
    __name(pushDirective, "pushDirective");
    __name(callMiddleware, "callMiddleware");
    __name(createRequest, "createRequest");
    __name(findRouteToRewrite, "findRouteToRewrite");
    __name(copyRequest, "copyRequest");
    __name(setOriginPathname, "setOriginPathname");
    __name(getOriginPathname, "getOriginPathname");
    VALID_PARAM_TYPES = ["string", "number", "undefined"];
    __name(validateGetStaticPathsParameter, "validateGetStaticPathsParameter");
    __name(validateDynamicRouteModule, "validateDynamicRouteModule");
    __name(validateGetStaticPathsResult, "validateGetStaticPathsResult");
    __name(stringifyParams, "stringifyParams");
    __name(generatePaginateFunction, "generatePaginateFunction");
    __name(addRouteBase, "addRouteBase");
    __name(callGetStaticPaths, "callGetStaticPaths");
    RouteCache = class {
      static {
        __name(this, "RouteCache");
      }
      logger;
      cache = {};
      runtimeMode;
      constructor(logger, runtimeMode = "production") {
        this.logger = logger;
        this.runtimeMode = runtimeMode;
      }
      /** Clear the cache. */
      clearAll() {
        this.cache = {};
      }
      set(route, entry) {
        const key = this.key(route);
        if (this.runtimeMode === "production" && this.cache[key]?.staticPaths) {
          this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
        }
        this.cache[key] = entry;
      }
      get(route) {
        return this.cache[this.key(route)];
      }
      key(route) {
        return `${route.route}_${route.component}`;
      }
    };
    __name(findPathItemByKey, "findPathItemByKey");
    __name(routeIsRedirect, "routeIsRedirect");
    __name(routeIsFallback, "routeIsFallback");
    __name(getProps, "getProps");
    __name(getParams, "getParams");
    __name(validatePrerenderEndpointCollision, "validatePrerenderEndpointCollision");
    __name(getFunctionExpression, "getFunctionExpression");
    Slots = class {
      static {
        __name(this, "Slots");
      }
      #result;
      #slots;
      #logger;
      constructor(result, slots, logger) {
        this.#result = result;
        this.#slots = slots;
        this.#logger = logger;
        if (slots) {
          for (const key of Object.keys(slots)) {
            if (this[key] !== void 0) {
              throw new AstroError({
                ...ReservedSlotName,
                message: ReservedSlotName.message(key)
              });
            }
            Object.defineProperty(this, key, {
              get() {
                return true;
              },
              enumerable: true
            });
          }
        }
      }
      has(name) {
        if (!this.#slots) return false;
        return Boolean(this.#slots[name]);
      }
      async render(name, args = []) {
        if (!this.#slots || !this.has(name)) return;
        const result = this.#result;
        if (!Array.isArray(args)) {
          this.#logger.warn(
            null,
            `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
          );
        } else if (args.length > 0) {
          const slotValue = this.#slots[name];
          const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
          const expression = getFunctionExpression(component);
          if (expression) {
            const slot = /* @__PURE__ */ __name(async () => typeof expression === "function" ? expression(...args) : expression, "slot");
            return await renderSlotToString(result, slot).then((res) => {
              return res;
            });
          }
          if (typeof component === "function") {
            return await renderJSX(result, component(...args)).then(
              (res) => res != null ? String(res) : res
            );
          }
        }
        const content = await renderSlotToString(result, this.#slots[name]);
        const outHTML = chunkToString(result, content);
        return outHTML;
      }
    };
    __name(sequence, "sequence");
    __name(defineMiddleware, "defineMiddleware");
    suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    __name(jsonParseTransform, "jsonParseTransform");
    __name(warnKeyDropped, "warnKeyDropped");
    __name(destr, "destr");
    __name(wrapToPromise, "wrapToPromise");
    __name(asyncCall, "asyncCall");
    __name(isPrimitive, "isPrimitive");
    __name(isPureObject, "isPureObject");
    __name(stringify$1, "stringify$1");
    BASE64_PREFIX = "base64:";
    __name(serializeRaw, "serializeRaw");
    __name(deserializeRaw, "deserializeRaw");
    __name(base64Decode, "base64Decode");
    __name(base64Encode, "base64Encode");
    __name(normalizeKey, "normalizeKey");
    __name(joinKeys, "joinKeys");
    __name(normalizeBaseKey, "normalizeBaseKey");
    __name(filterKeyByDepth, "filterKeyByDepth");
    __name(filterKeyByBase, "filterKeyByBase");
    __name(defineDriver, "defineDriver");
    DRIVER_NAME = "memory";
    memory = defineDriver(() => {
      const data = /* @__PURE__ */ new Map();
      return {
        name: DRIVER_NAME,
        getInstance: /* @__PURE__ */ __name(() => data, "getInstance"),
        hasItem(key) {
          return data.has(key);
        },
        getItem(key) {
          return data.get(key) ?? null;
        },
        getItemRaw(key) {
          return data.get(key) ?? null;
        },
        setItem(key, value) {
          data.set(key, value);
        },
        setItemRaw(key, value) {
          data.set(key, value);
        },
        removeItem(key) {
          data.delete(key);
        },
        getKeys() {
          return [...data.keys()];
        },
        clear() {
          data.clear();
        },
        dispose() {
          data.clear();
        }
      };
    });
    __name(createStorage, "createStorage");
    __name(watch, "watch");
    __name(dispose, "dispose");
    builtinDrivers = {
      "azure-app-configuration": "unstorage/drivers/azure-app-configuration",
      "azureAppConfiguration": "unstorage/drivers/azure-app-configuration",
      "azure-cosmos": "unstorage/drivers/azure-cosmos",
      "azureCosmos": "unstorage/drivers/azure-cosmos",
      "azure-key-vault": "unstorage/drivers/azure-key-vault",
      "azureKeyVault": "unstorage/drivers/azure-key-vault",
      "azure-storage-blob": "unstorage/drivers/azure-storage-blob",
      "azureStorageBlob": "unstorage/drivers/azure-storage-blob",
      "azure-storage-table": "unstorage/drivers/azure-storage-table",
      "azureStorageTable": "unstorage/drivers/azure-storage-table",
      "capacitor-preferences": "unstorage/drivers/capacitor-preferences",
      "capacitorPreferences": "unstorage/drivers/capacitor-preferences",
      "cloudflare-kv-binding": "unstorage/drivers/cloudflare-kv-binding",
      "cloudflareKVBinding": "unstorage/drivers/cloudflare-kv-binding",
      "cloudflare-kv-http": "unstorage/drivers/cloudflare-kv-http",
      "cloudflareKVHttp": "unstorage/drivers/cloudflare-kv-http",
      "cloudflare-r2-binding": "unstorage/drivers/cloudflare-r2-binding",
      "cloudflareR2Binding": "unstorage/drivers/cloudflare-r2-binding",
      "db0": "unstorage/drivers/db0",
      "deno-kv-node": "unstorage/drivers/deno-kv-node",
      "denoKVNode": "unstorage/drivers/deno-kv-node",
      "deno-kv": "unstorage/drivers/deno-kv",
      "denoKV": "unstorage/drivers/deno-kv",
      "fs-lite": "unstorage/drivers/fs-lite",
      "fsLite": "unstorage/drivers/fs-lite",
      "fs": "unstorage/drivers/fs",
      "github": "unstorage/drivers/github",
      "http": "unstorage/drivers/http",
      "indexedb": "unstorage/drivers/indexedb",
      "localstorage": "unstorage/drivers/localstorage",
      "lru-cache": "unstorage/drivers/lru-cache",
      "lruCache": "unstorage/drivers/lru-cache",
      "memory": "unstorage/drivers/memory",
      "mongodb": "unstorage/drivers/mongodb",
      "netlify-blobs": "unstorage/drivers/netlify-blobs",
      "netlifyBlobs": "unstorage/drivers/netlify-blobs",
      "null": "unstorage/drivers/null",
      "overlay": "unstorage/drivers/overlay",
      "planetscale": "unstorage/drivers/planetscale",
      "redis": "unstorage/drivers/redis",
      "s3": "unstorage/drivers/s3",
      "session-storage": "unstorage/drivers/session-storage",
      "sessionStorage": "unstorage/drivers/session-storage",
      "uploadthing": "unstorage/drivers/uploadthing",
      "upstash": "unstorage/drivers/upstash",
      "vercel-blob": "unstorage/drivers/vercel-blob",
      "vercelBlob": "unstorage/drivers/vercel-blob",
      "vercel-kv": "unstorage/drivers/vercel-kv",
      "vercelKV": "unstorage/drivers/vercel-kv",
      "vercel-runtime-cache": "unstorage/drivers/vercel-runtime-cache",
      "vercelRuntimeCache": "unstorage/drivers/vercel-runtime-cache"
    };
    PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
    DEFAULT_COOKIE_NAME = "astro-session";
    VALID_COOKIE_REGEX = /^[\w-]+$/;
    unflatten2 = /* @__PURE__ */ __name((parsed, _) => {
      return unflatten(parsed, {
        URL: /* @__PURE__ */ __name((href) => new URL(href), "URL")
      });
    }, "unflatten");
    stringify2 = /* @__PURE__ */ __name((data, _) => {
      return stringify(data, {
        // Support URL objects
        URL: /* @__PURE__ */ __name((val) => val instanceof URL && val.href, "URL")
      });
    }, "stringify");
    AstroSession = class _AstroSession {
      static {
        __name(this, "AstroSession");
      }
      // The cookies object.
      #cookies;
      // The session configuration.
      #config;
      // The cookie config
      #cookieConfig;
      // The cookie name
      #cookieName;
      // The unstorage object for the session driver.
      #storage;
      #data;
      // The session ID. A v4 UUID.
      #sessionID;
      // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
      #toDestroy = /* @__PURE__ */ new Set();
      // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
      #toDelete = /* @__PURE__ */ new Set();
      // Whether the session is dirty and needs to be saved.
      #dirty = false;
      // Whether the session cookie has been set.
      #cookieSet = false;
      // The local data is "partial" if it has not been loaded from storage yet and only
      // contains values that have been set or deleted in-memory locally.
      // We do this to avoid the need to block on loading data when it is only being set.
      // When we load the data from storage, we need to merge it with the local partial data,
      // preserving in-memory changes and deletions.
      #partial = true;
      static #sharedStorage = /* @__PURE__ */ new Map();
      constructor(cookies, {
        cookie: cookieConfig = DEFAULT_COOKIE_NAME,
        ...config
      }, runtimeMode) {
        const { driver } = config;
        if (!driver) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "No driver was defined in the session configuration and the adapter did not provide a default driver."
            )
          });
        }
        this.#cookies = cookies;
        let cookieConfigObject;
        if (typeof cookieConfig === "object") {
          const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
          this.#cookieName = name;
          cookieConfigObject = rest;
        } else {
          this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
        }
        this.#cookieConfig = {
          sameSite: "lax",
          secure: runtimeMode === "production",
          path: "/",
          ...cookieConfigObject,
          httpOnly: true
        };
        this.#config = { ...config, driver };
      }
      /**
       * Gets a session value. Returns `undefined` if the session or value does not exist.
       */
      async get(key) {
        return (await this.#ensureData()).get(key)?.data;
      }
      /**
       * Checks if a session value exists.
       */
      async has(key) {
        return (await this.#ensureData()).has(key);
      }
      /**
       * Gets all session values.
       */
      async keys() {
        return (await this.#ensureData()).keys();
      }
      /**
       * Gets all session values.
       */
      async values() {
        return [...(await this.#ensureData()).values()].map((entry) => entry.data);
      }
      /**
       * Gets all session entries.
       */
      async entries() {
        return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
      }
      /**
       * Deletes a session value.
       */
      delete(key) {
        this.#data?.delete(key);
        if (this.#partial) {
          this.#toDelete.add(key);
        }
        this.#dirty = true;
      }
      /**
       * Sets a session value. The session is created if it does not exist.
       */
      set(key, value, { ttl } = {}) {
        if (!key) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "The session key was not provided."
          });
        }
        let cloned;
        try {
          cloned = unflatten2(JSON.parse(stringify2(value)));
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageSaveError,
              message: `The session data for ${key} could not be serialized.`,
              hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
            },
            { cause: err }
          );
        }
        if (!this.#cookieSet) {
          this.#setCookie();
          this.#cookieSet = true;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const lifetime = ttl ?? this.#config.ttl;
        const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
        this.#data.set(key, {
          data: cloned,
          expires
        });
        this.#dirty = true;
      }
      /**
       * Destroys the session, clearing the cookie and storage if it exists.
       */
      destroy() {
        const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
        if (sessionId) {
          this.#toDestroy.add(sessionId);
        }
        this.#cookies.delete(this.#cookieName, this.#cookieConfig);
        this.#sessionID = void 0;
        this.#data = void 0;
        this.#dirty = true;
      }
      /**
       * Regenerates the session, creating a new session ID. The existing session data is preserved.
       */
      async regenerate() {
        let data = /* @__PURE__ */ new Map();
        try {
          data = await this.#ensureData();
        } catch (err) {
          console.error("Failed to load session data during regeneration:", err);
        }
        const oldSessionId = this.#sessionID;
        this.#sessionID = crypto.randomUUID();
        this.#data = data;
        await this.#setCookie();
        if (oldSessionId && this.#storage) {
          this.#storage.removeItem(oldSessionId).catch((err) => {
            console.error("Failed to remove old session data:", err);
          });
        }
      }
      // Persists the session data to storage.
      // This is called automatically at the end of the request.
      // Uses a symbol to prevent users from calling it directly.
      async [PERSIST_SYMBOL]() {
        if (!this.#dirty && !this.#toDestroy.size) {
          return;
        }
        const storage = await this.#ensureStorage();
        if (this.#dirty && this.#data) {
          const data = await this.#ensureData();
          this.#toDelete.forEach((key2) => data.delete(key2));
          const key = this.#ensureSessionID();
          let serialized;
          try {
            serialized = stringify2(data);
          } catch (err) {
            throw new AstroError(
              {
                ...SessionStorageSaveError,
                message: SessionStorageSaveError.message(
                  "The session data could not be serialized.",
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          await storage.setItem(key, serialized);
          this.#dirty = false;
        }
        if (this.#toDestroy.size > 0) {
          const cleanupPromises = [...this.#toDestroy].map(
            (sessionId) => storage.removeItem(sessionId).catch((err) => {
              console.error(`Failed to clean up session ${sessionId}:`, err);
            })
          );
          await Promise.all(cleanupPromises);
          this.#toDestroy.clear();
        }
      }
      get sessionID() {
        return this.#sessionID;
      }
      /**
       * Loads a session from storage with the given ID, and replaces the current session.
       * Any changes made to the current session will be lost.
       * This is not normally needed, as the session is automatically loaded using the cookie.
       * However it can be used to restore a session where the ID has been recorded somewhere
       * else (e.g. in a database).
       */
      async load(sessionID) {
        this.#sessionID = sessionID;
        this.#data = void 0;
        await this.#setCookie();
        await this.#ensureData();
      }
      /**
       * Sets the session cookie.
       */
      async #setCookie() {
        if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
          });
        }
        const value = this.#ensureSessionID();
        this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
      }
      /**
       * Attempts to load the session data from storage, or creates a new data object if none exists.
       * If there is existing partial data, it will be merged into the new data object.
       */
      async #ensureData() {
        const storage = await this.#ensureStorage();
        if (this.#data && !this.#partial) {
          return this.#data;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const raw = await storage.get(this.#ensureSessionID());
        if (!raw) {
          return this.#data;
        }
        try {
          const storedMap = unflatten2(raw);
          if (!(storedMap instanceof Map)) {
            await this.destroy();
            throw new AstroError({
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data was an invalid type.",
                this.#config.driver
              )
            });
          }
          const now = Date.now();
          for (const [key, value] of storedMap) {
            const expired = typeof value.expires === "number" && value.expires < now;
            if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
              this.#data.set(key, value);
            }
          }
          this.#partial = false;
          return this.#data;
        } catch (err) {
          await this.destroy();
          if (err instanceof AstroError) {
            throw err;
          }
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data could not be parsed.",
                this.#config.driver
              )
            },
            { cause: err }
          );
        }
      }
      /**
       * Returns the session ID, generating a new one if it does not exist.
       */
      #ensureSessionID() {
        this.#sessionID ??= this.#cookies.get(this.#cookieName)?.value ?? crypto.randomUUID();
        return this.#sessionID;
      }
      /**
       * Ensures the storage is initialized.
       * This is called automatically when a storage operation is needed.
       */
      async #ensureStorage() {
        if (this.#storage) {
          return this.#storage;
        }
        if (_AstroSession.#sharedStorage.has(this.#config.driver)) {
          this.#storage = _AstroSession.#sharedStorage.get(this.#config.driver);
          return this.#storage;
        }
        if (this.#config.driver === "test") {
          this.#storage = this.#config.options.mockStorage;
          return this.#storage;
        }
        if (this.#config.driver === "fs" || this.#config.driver === "fsLite" || this.#config.driver === "fs-lite") {
          this.#config.options ??= {};
          this.#config.driver = "fs-lite";
          this.#config.options.base ??= ".astro/session";
        }
        let driver = null;
        try {
          if (this.#config.driverModule) {
            driver = (await this.#config.driverModule()).default;
          } else if (this.#config.driver) {
            const driverName = resolveSessionDriverName(this.#config.driver);
            if (driverName) {
              driver = (await import(driverName)).default;
            }
          }
        } catch (err) {
          if (err.code === "ERR_MODULE_NOT_FOUND") {
            throw new AstroError(
              {
                ...SessionStorageInitError,
                message: SessionStorageInitError.message(
                  err.message.includes(`Cannot find package`) ? "The driver module could not be found." : err.message,
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          throw err;
        }
        if (!driver) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "The module did not export a driver.",
              this.#config.driver
            )
          });
        }
        try {
          this.#storage = createStorage({
            driver: driver(this.#config.options)
          });
          _AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
          return this.#storage;
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message("Unknown error", this.#config.driver)
            },
            { cause: err }
          );
        }
      }
    };
    __name(resolveSessionDriverName, "resolveSessionDriverName");
    __name(validateAndDecodePathname, "validateAndDecodePathname");
    apiContextRoutesSymbol = /* @__PURE__ */ Symbol.for("context.routes");
    RenderContext = class _RenderContext {
      static {
        __name(this, "RenderContext");
      }
      constructor(pipeline, locals, middleware, actions, pathname, request, routeData, status, clientAddress, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = _RenderContext.#createNormalizedUrl(request.url), props = {}, partial = void 0, shouldInjectCspMetaTags = !!pipeline.manifest.csp, session = pipeline.manifest.sessionConfig ? new AstroSession(cookies, pipeline.manifest.sessionConfig, pipeline.runtimeMode) : void 0) {
        this.pipeline = pipeline;
        this.locals = locals;
        this.middleware = middleware;
        this.actions = actions;
        this.pathname = pathname;
        this.request = request;
        this.routeData = routeData;
        this.status = status;
        this.clientAddress = clientAddress;
        this.cookies = cookies;
        this.params = params;
        this.url = url;
        this.props = props;
        this.partial = partial;
        this.shouldInjectCspMetaTags = shouldInjectCspMetaTags;
        this.session = session;
      }
      static #createNormalizedUrl(requestUrl) {
        const url = new URL(requestUrl);
        try {
          url.pathname = validateAndDecodePathname(url.pathname);
        } catch {
          try {
            url.pathname = decodeURI(url.pathname);
          } catch {
          }
        }
        return url;
      }
      /**
       * A flag that tells the render content if the rewriting was triggered
       */
      isRewriting = false;
      /**
       * A safety net in case of loops
       */
      counter = 0;
      result = void 0;
      static async create({
        locals = {},
        middleware,
        pathname,
        pipeline,
        request,
        routeData,
        clientAddress,
        status = 200,
        props,
        partial = void 0,
        actions,
        shouldInjectCspMetaTags
      }) {
        const pipelineMiddleware = await pipeline.getMiddleware();
        const pipelineActions = actions ?? await pipeline.getActions();
        setOriginPathname(
          request,
          pathname,
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        );
        return new _RenderContext(
          pipeline,
          locals,
          sequence(...pipeline.internalMiddleware, middleware ?? pipelineMiddleware),
          pipelineActions,
          pathname,
          request,
          routeData,
          status,
          clientAddress,
          void 0,
          void 0,
          void 0,
          props,
          partial,
          shouldInjectCspMetaTags ?? !!pipeline.manifest.csp
        );
      }
      /**
       * The main function of the RenderContext.
       *
       * Use this function to render any route known to Astro.
       * It attempts to render a route. A route can be a:
       *
       * - page
       * - redirect
       * - endpoint
       * - fallback
       */
      async render(componentInstance, slots = {}) {
        const { middleware, pipeline } = this;
        const { logger, serverLike, streaming, manifest: manifest2 } = pipeline;
        const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
          mod: componentInstance,
          routeData: this.routeData,
          routeCache: this.pipeline.routeCache,
          pathname: this.pathname,
          logger,
          serverLike,
          base: manifest2.base
        });
        const actionApiContext = this.createActionAPIContext();
        const apiContext = this.createAPIContext(props, actionApiContext);
        this.counter++;
        if (this.counter === 4) {
          return new Response("Loop Detected", {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
            status: 508,
            statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
          });
        }
        const lastNext = /* @__PURE__ */ __name(async (ctx, payload) => {
          if (payload) {
            const oldPathname = this.pathname;
            pipeline.logger.debug("router", "Called rewriting to:", payload);
            const {
              routeData,
              componentInstance: newComponent,
              pathname,
              newUrl
            } = await pipeline.tryRewrite(payload, this.request);
            if (this.pipeline.serverLike === true && this.routeData.prerender === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            this.routeData = routeData;
            componentInstance = newComponent;
            if (payload instanceof Request) {
              this.request = payload;
            } else {
              this.request = copyRequest(
                newUrl,
                this.request,
                // need to send the flag of the previous routeData
                routeData.prerender,
                this.pipeline.logger,
                this.routeData.route
              );
            }
            this.isRewriting = true;
            this.url = _RenderContext.#createNormalizedUrl(this.request.url);
            this.params = getParams(routeData, pathname);
            this.pathname = pathname;
            this.status = 200;
            setOriginPathname(
              this.request,
              oldPathname,
              this.pipeline.manifest.trailingSlash,
              this.pipeline.manifest.buildFormat
            );
          }
          let response2;
          if (!ctx.isPrerendered) {
            const { action, setActionResult, serializeActionResult: serializeActionResult2 } = getActionContext(ctx);
            if (action?.calledFrom === "form") {
              const actionResult = await action.handler();
              setActionResult(action.name, serializeActionResult2(actionResult));
            }
          }
          switch (this.routeData.type) {
            case "endpoint": {
              response2 = await renderEndpoint(
                componentInstance,
                ctx,
                this.routeData.prerender,
                logger
              );
              break;
            }
            case "redirect":
              return renderRedirect(this);
            case "page": {
              this.result = await this.createResult(componentInstance, actionApiContext);
              try {
                response2 = await renderPage(
                  this.result,
                  componentInstance?.default,
                  props,
                  slots,
                  streaming,
                  this.routeData
                );
              } catch (e2) {
                this.result.cancelled = true;
                throw e2;
              }
              response2.headers.set(ROUTE_TYPE_HEADER, "page");
              if (this.routeData.route === "/404" || this.routeData.route === "/500") {
                response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
              }
              if (this.isRewriting) {
                response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
              }
              break;
            }
            case "fallback": {
              return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
            }
          }
          const responseCookies = getCookiesFromResponse(response2);
          if (responseCookies) {
            this.cookies.merge(responseCookies);
          }
          return response2;
        }, "lastNext");
        if (isRouteExternalRedirect(this.routeData)) {
          return renderRedirect(this);
        }
        const response = await callMiddleware(middleware, apiContext, lastNext);
        if (response.headers.get(ROUTE_TYPE_HEADER)) {
          response.headers.delete(ROUTE_TYPE_HEADER);
        }
        attachCookiesToResponse(response, this.cookies);
        return response;
      }
      createAPIContext(props, context) {
        const redirect = /* @__PURE__ */ __name((path, status = 302) => new Response(null, { status, headers: { Location: path } }), "redirect");
        Reflect.set(context, apiContextRoutesSymbol, this.pipeline);
        return Object.assign(context, {
          props,
          redirect,
          getActionResult: createGetActionResult(context.locals),
          callAction: createCallAction(context)
        });
      }
      async #executeRewrite(reroutePayload) {
        this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
        const oldPathname = this.pathname;
        const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
          reroutePayload,
          this.request
        );
        const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
        if (this.pipeline.serverLike && !this.routeData.prerender && routeData.prerender && !isI18nFallback) {
          throw new AstroError({
            ...ForbiddenRewrite,
            message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
            hint: ForbiddenRewrite.hint(routeData.component)
          });
        }
        this.routeData = routeData;
        if (reroutePayload instanceof Request) {
          this.request = reroutePayload;
        } else {
          this.request = copyRequest(
            newUrl,
            this.request,
            // need to send the flag of the previous routeData
            routeData.prerender,
            this.pipeline.logger,
            this.routeData.route
          );
        }
        this.url = _RenderContext.#createNormalizedUrl(this.request.url);
        const newCookies = new AstroCookies(this.request);
        if (this.cookies) {
          newCookies.merge(this.cookies);
        }
        this.cookies = newCookies;
        this.params = getParams(routeData, pathname);
        this.pathname = pathname;
        this.isRewriting = true;
        this.status = 200;
        setOriginPathname(
          this.request,
          oldPathname,
          this.pipeline.manifest.trailingSlash,
          this.pipeline.manifest.buildFormat
        );
        return await this.render(componentInstance);
      }
      createActionAPIContext() {
        const renderContext = this;
        const { params, pipeline, url } = this;
        const generator = `Astro v${ASTRO_VERSION}`;
        const rewrite = /* @__PURE__ */ __name(async (reroutePayload) => {
          return await this.#executeRewrite(reroutePayload);
        }, "rewrite");
        return {
          // Don't allow reassignment of cookies because it doesn't work
          get cookies() {
            return renderContext.cookies;
          },
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          get clientAddress() {
            return renderContext.getClientAddress();
          },
          get currentLocale() {
            return renderContext.computeCurrentLocale();
          },
          generator,
          get locals() {
            return renderContext.locals;
          },
          set locals(_) {
            throw new AstroError(LocalsReassigned);
          },
          params,
          get preferredLocale() {
            return renderContext.computePreferredLocale();
          },
          get preferredLocaleList() {
            return renderContext.computePreferredLocaleList();
          },
          rewrite,
          request: this.request,
          site: pipeline.site,
          url,
          get originPathname() {
            return getOriginPathname(renderContext.request);
          },
          get session() {
            if (this.isPrerendered) {
              pipeline.logger.warn(
                "session",
                `context.session was used when rendering the route ${s.green(this.routePattern)}, but it is not available on prerendered routes. If you need access to sessions, make sure that the route is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your routes server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            if (!renderContext.session) {
              pipeline.logger.warn(
                "session",
                `context.session was used when rendering the route ${s.green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            return renderContext.session;
          },
          get csp() {
            return {
              insertDirective(payload) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                if (renderContext?.result?.directives) {
                  renderContext.result.directives = pushDirective(
                    renderContext.result.directives,
                    payload
                  );
                } else {
                  renderContext?.result?.directives.push(payload);
                }
              },
              insertScriptResource(resource) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.scriptResources.push(resource);
              },
              insertStyleResource(resource) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.styleResources.push(resource);
              },
              insertStyleHash(hash) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.styleHashes.push(hash);
              },
              insertScriptHash(hash) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.scriptHashes.push(hash);
              }
            };
          }
        };
      }
      async createResult(mod, ctx) {
        const { cookies, pathname, pipeline, routeData, status } = this;
        const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
        const { links, scripts, styles } = await pipeline.headElements(routeData);
        const extraStyleHashes = [];
        const extraScriptHashes = [];
        const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags;
        const cspAlgorithm = manifest2.csp?.algorithm ?? "SHA-256";
        if (shouldInjectCspMetaTags) {
          for (const style of styles) {
            extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
          }
          for (const script of scripts) {
            extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
          }
        }
        const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
        const headers = new Headers({ "Content-Type": "text/html" });
        const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
        const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
        const response = {
          status: actionResult?.error ? actionResult?.error.status : status,
          statusText: actionResult?.error ? actionResult?.error.type : "OK",
          get headers() {
            return headers;
          },
          // Disallow `Astro.response.headers = new Headers`
          set headers(_) {
            throw new AstroError(AstroResponseHeadersReassigned);
          }
        };
        const result = {
          base: manifest2.base,
          userAssetsBase: manifest2.userAssetsBase,
          cancelled: false,
          clientDirectives,
          inlinedScripts,
          componentMetadata,
          compressHTML,
          cookies,
          /** This function returns the `Astro` faux-global */
          createAstro: /* @__PURE__ */ __name((astroGlobal, props, slots) => this.createAstro(result, astroGlobal, props, slots, ctx), "createAstro"),
          links,
          params: this.params,
          partial,
          pathname,
          renderers: renderers2,
          resolve,
          response,
          request: this.request,
          scripts,
          styles,
          actionResult,
          serverIslandNameMap: manifest2.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
          key: manifest2.key,
          trailingSlash: manifest2.trailingSlash,
          _metadata: {
            hasHydrationScript: false,
            rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
            hasRenderedHead: false,
            renderedScripts: /* @__PURE__ */ new Set(),
            hasDirectives: /* @__PURE__ */ new Set(),
            hasRenderedServerIslandRuntime: false,
            headInTree: false,
            extraHead: [],
            extraStyleHashes,
            extraScriptHashes,
            propagators: /* @__PURE__ */ new Set()
          },
          cspDestination: manifest2.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
          shouldInjectCspMetaTags,
          cspAlgorithm,
          // The following arrays must be cloned, otherwise they become mutable across routes.
          scriptHashes: manifest2.csp?.scriptHashes ? [...manifest2.csp.scriptHashes] : [],
          scriptResources: manifest2.csp?.scriptResources ? [...manifest2.csp.scriptResources] : [],
          styleHashes: manifest2.csp?.styleHashes ? [...manifest2.csp.styleHashes] : [],
          styleResources: manifest2.csp?.styleResources ? [...manifest2.csp.styleResources] : [],
          directives: manifest2.csp?.directives ? [...manifest2.csp.directives] : [],
          isStrictDynamic: manifest2.csp?.isStrictDynamic ?? false,
          internalFetchHeaders: manifest2.internalFetchHeaders
        };
        return result;
      }
      #astroPagePartial;
      /**
       * The Astro global is sourced in 3 different phases:
       * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
       * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
       * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
       *
       * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
       */
      createAstro(result, astroStaticPartial, props, slotValues, apiContext) {
        let astroPagePartial;
        if (this.isRewriting) {
          astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(
            result,
            astroStaticPartial,
            apiContext
          );
        } else {
          astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(
            result,
            astroStaticPartial,
            apiContext
          );
        }
        const astroComponentPartial = { props, self: null };
        const Astro = Object.assign(
          Object.create(astroPagePartial),
          astroComponentPartial
        );
        let _slots;
        Object.defineProperty(Astro, "slots", {
          get: /* @__PURE__ */ __name(() => {
            if (!_slots) {
              _slots = new Slots(
                result,
                slotValues,
                this.pipeline.logger
              );
            }
            return _slots;
          }, "get")
        });
        return Astro;
      }
      createAstroPagePartial(result, astroStaticPartial, apiContext) {
        const renderContext = this;
        const { cookies, locals, params, pipeline, url } = this;
        const { response } = result;
        const redirect = /* @__PURE__ */ __name((path, status = 302) => {
          if (this.request[responseSentSymbol]) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          return new Response(null, { status, headers: { Location: path } });
        }, "redirect");
        const rewrite = /* @__PURE__ */ __name(async (reroutePayload) => {
          return await this.#executeRewrite(reroutePayload);
        }, "rewrite");
        const callAction = createCallAction(apiContext);
        return {
          generator: astroStaticPartial.generator,
          glob: astroStaticPartial.glob,
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          cookies,
          get session() {
            if (this.isPrerendered) {
              pipeline.logger.warn(
                "session",
                `Astro.session was used when rendering the route ${s.green(this.routePattern)}, but it is not available on prerendered pages. If you need access to sessions, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            if (!renderContext.session) {
              pipeline.logger.warn(
                "session",
                `Astro.session was used when rendering the route ${s.green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            return renderContext.session;
          },
          get clientAddress() {
            return renderContext.getClientAddress();
          },
          get currentLocale() {
            return renderContext.computeCurrentLocale();
          },
          params,
          get preferredLocale() {
            return renderContext.computePreferredLocale();
          },
          get preferredLocaleList() {
            return renderContext.computePreferredLocaleList();
          },
          locals,
          redirect,
          rewrite,
          request: this.request,
          response,
          site: pipeline.site,
          getActionResult: createGetActionResult(locals),
          get callAction() {
            return callAction;
          },
          url,
          get originPathname() {
            return getOriginPathname(renderContext.request);
          },
          get csp() {
            return {
              insertDirective(payload) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                if (renderContext?.result?.directives) {
                  renderContext.result.directives = pushDirective(
                    renderContext.result.directives,
                    payload
                  );
                } else {
                  renderContext?.result?.directives.push(payload);
                }
              },
              insertScriptResource(resource) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.scriptResources.push(resource);
              },
              insertStyleResource(resource) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.styleResources.push(resource);
              },
              insertStyleHash(hash) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.styleHashes.push(hash);
              },
              insertScriptHash(hash) {
                if (!pipeline.manifest.csp) {
                  throw new AstroError(CspNotEnabled);
                }
                renderContext.result?.scriptHashes.push(hash);
              }
            };
          }
        };
      }
      getClientAddress() {
        const { pipeline, request, routeData, clientAddress } = this;
        if (routeData.prerender) {
          throw new AstroError({
            ...PrerenderClientAddressNotAvailable,
            message: PrerenderClientAddressNotAvailable.message(routeData.component)
          });
        }
        if (clientAddress) {
          return clientAddress;
        }
        if (clientAddressSymbol in request) {
          return Reflect.get(request, clientAddressSymbol);
        }
        if (pipeline.adapterName) {
          throw new AstroError({
            ...ClientAddressNotAvailable,
            message: ClientAddressNotAvailable.message(pipeline.adapterName)
          });
        }
        throw new AstroError(StaticClientAddressNotAvailable);
      }
      /**
       * API Context may be created multiple times per request, i18n data needs to be computed only once.
       * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
       */
      #currentLocale;
      computeCurrentLocale() {
        const {
          url,
          pipeline: { i18n },
          routeData
        } = this;
        if (!i18n) return;
        const { defaultLocale, locales, strategy } = i18n;
        const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
        if (this.#currentLocale) {
          return this.#currentLocale;
        }
        let computedLocale;
        if (isRouteServerIsland(routeData)) {
          let referer = this.request.headers.get("referer");
          if (referer) {
            if (URL.canParse(referer)) {
              referer = new URL(referer).pathname;
            }
            computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
          }
        } else {
          let pathname = routeData.pathname;
          if (!routeData.pattern.test(url.pathname)) {
            for (const fallbackRoute of routeData.fallbackRoutes) {
              if (fallbackRoute.pattern.test(url.pathname)) {
                pathname = fallbackRoute.pathname;
                break;
              }
            }
          }
          pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname;
          computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
        }
        this.#currentLocale = computedLocale ?? fallbackTo;
        return this.#currentLocale;
      }
      #preferredLocale;
      computePreferredLocale() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n) return;
        return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
      }
      #preferredLocaleList;
      computePreferredLocaleList() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n) return;
        return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
      }
    };
  }
});

// dist/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs
var cloudflare_kv_binding_DMly_2Gl_exports = {};
__export(cloudflare_kv_binding_DMly_2Gl_exports, {
  default: () => cloudflareKvBinding
});
function defineDriver2(factory) {
  return factory;
}
function normalizeKey2(key, sep = ":") {
  if (!key) {
    return "";
  }
  return key.replace(/[:/\\]/g, sep).replace(/^[:/\\]|[:/\\]$/g, "");
}
function joinKeys2(...keys) {
  return keys.map((key) => normalizeKey2(key)).filter(Boolean).join(":");
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function getBinding(binding) {
  let bindingName = "[binding]";
  if (typeof binding === "string") {
    bindingName = binding;
    binding = globalThis[bindingName] || globalThis.__env__?.[bindingName];
  }
  if (!binding) {
    throw createError(
      "cloudflare",
      `Invalid binding \`${bindingName}\`: \`${binding}\``
    );
  }
  for (const key of ["get", "put", "delete"]) {
    if (!(key in binding)) {
      throw createError(
        "cloudflare",
        `Invalid binding \`${bindingName}\`: \`${key}\` key is missing`
      );
    }
  }
  return binding;
}
function getKVBinding(binding = "STORAGE") {
  return getBinding(binding);
}
var DRIVER_NAME2, cloudflareKvBinding;
var init_cloudflare_kv_binding_DMly_2Gl = __esm({
  "dist/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(defineDriver2, "defineDriver");
    __name(normalizeKey2, "normalizeKey");
    __name(joinKeys2, "joinKeys");
    __name(createError, "createError");
    __name(getBinding, "getBinding");
    __name(getKVBinding, "getKVBinding");
    DRIVER_NAME2 = "cloudflare-kv-binding";
    cloudflareKvBinding = defineDriver2((opts) => {
      const r2 = /* @__PURE__ */ __name((key = "") => opts.base ? joinKeys2(opts.base, key) : key, "r");
      async function getKeys(base = "") {
        base = r2(base);
        const binding = getKVBinding(opts.binding);
        const keys = [];
        let cursor = void 0;
        do {
          const kvList = await binding.list({ prefix: base || void 0, cursor });
          keys.push(...kvList.keys);
          cursor = kvList.list_complete ? void 0 : kvList.cursor;
        } while (cursor);
        return keys.map((key) => key.name);
      }
      __name(getKeys, "getKeys");
      return {
        name: DRIVER_NAME2,
        options: opts,
        getInstance: /* @__PURE__ */ __name(() => getKVBinding(opts.binding), "getInstance"),
        async hasItem(key) {
          key = r2(key);
          const binding = getKVBinding(opts.binding);
          return await binding.get(key) !== null;
        },
        getItem(key) {
          key = r2(key);
          const binding = getKVBinding(opts.binding);
          return binding.get(key);
        },
        setItem(key, value, topts) {
          key = r2(key);
          const binding = getKVBinding(opts.binding);
          return binding.put(
            key,
            value,
            topts ? {
              expirationTtl: topts?.ttl ? Math.max(topts.ttl, opts.minTTL ?? 60) : void 0,
              ...topts
            } : void 0
          );
        },
        removeItem(key) {
          key = r2(key);
          const binding = getKVBinding(opts.binding);
          return binding.delete(key);
        },
        getKeys(base) {
          return getKeys(base).then(
            (keys) => keys.map((key) => opts.base ? key.slice(opts.base.length) : key)
          );
        },
        async clear(base) {
          const binding = getKVBinding(opts.binding);
          const keys = await getKeys(base);
          await Promise.all(keys.map((key) => binding.delete(key)));
        }
      };
    });
  }
});

// dist/_worker.js/chunks/config_owevsWhQ.mjs
var siteConfig, entity;
var init_config_owevsWhQ = __esm({
  "dist/_worker.js/chunks/config_owevsWhQ.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    siteConfig = {
      name: "Wat Chiang Man",
      phone: "",
      // Synced from Google Maps user reviews — see `sync.time` in i18n/*.json
      rating: "4.7",
      coords: { lat: 18.7938, lng: 98.9867 },
      // Google Maps — shared by Hero / Gallery / Reviews / Footer (4 visible links) + JSON-LD sameAs
      mapsUrl: "https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7",
      // Map embed (right-side thumbnail) — language params are swapped per locale at render time
      googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.097391520713!2d98.98669001232625!3d18.79381258227997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a97936133d7%3A0x6e33b1cdc659f2dd!2z5riF5pu85a-6!5e0!3m2!1szh-CN!2sus!4v1784707773196!5m2!1szh-CN!2sus",
      address: "171 Ratchapakhinai Rd, Old City, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand",
      // Canonical photo naming: wat-chiang-man-chiang-mai-1.jpg …
      galleryPrefix: "wat-chiang-man-chiang-mai-",
      sources: [
        { name: "Wikipedia \u2014 Wat Chiang Man", url: "https://en.wikipedia.org/wiki/Wat_Chiang_Man" },
        { name: "Tourism Authority of Thailand", url: "https://www.tourismthailand.org/" },
        { name: "Google Maps \u2014 Wat Chiang Man", url: "https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7" }
      ],
      openMeteo: { latitude: 18.7938, longitude: 98.9867, timezone: "Asia/Bangkok" }
    };
    entity = {
      domain: "watchiangman.com",
      fullName: "Wat Chiang Man",
      // Domain meaning: watchiangman.com → “Wat Chiang Man”
      shortName: "Wat Chiang Man",
      localName: "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19",
      category: "Buddhist temple",
      city: "Chiang Mai",
      stateProvince: "Chiang Mai",
      country: "Thailand",
      countryCode2Letter: "TH",
      postalCode: "50200",
      streetAddress: "171 Ratchapakhinai Rd, Old City, Si Phum",
      latitude: 18.7938,
      longitude: 98.9867,
      mapsShareUrl: "https://maps.app.goo.gl/DdaTVFZ9VYRFPztZ7",
      nearbyLandmark1: "Wat Phra Singh",
      govtTourismUrl: "https://www.tourismthailand.org/",
      heroImage: "/gallery/wat-chiang-man-chiang-mai-13.jpg"
    };
  }
});

// dist/_worker.js/chunks/ui_wPxP0zJ8.mjs
var meta$2, sync$2, imageCopyright$2, breadcrumb$2, header$2, weather$2, seasons$2, routes$2, itinerary$2, facilities$2, responsibility$2, legends$2, hero$2, about$2, arch$2, history$2, guide$2, food$2, gallery$2, reviews$2, sources$2, mapSection$2, footer$2, legal$2, th, meta$1, sync$1, imageCopyright$1, breadcrumb$1, header$1, weather$1, seasons$1, routes$1, itinerary$1, facilities$1, responsibility$1, legends$1, hero$1, about$1, arch$1, history$1, guide$1, food$1, gallery$1, reviews$1, sources$1, mapSection$1, footer$1, legal$1, en, meta, sync, imageCopyright, breadcrumb, header, weather, seasons, routes, itinerary, facilities, responsibility, legends, hero, about, arch, history, guide, food, gallery, reviews, sources, mapSection, footer, legal, zh, defaultLang, messagesMap, messagesFor;
var init_ui_wPxP0zJ8 = __esm({
  "dist/_worker.js/chunks/ui_wPxP0zJ8.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    meta$2 = { "title": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 - \u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14 (\u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E1F\u0E23\u0E35 \xB7 \u0E40\u0E27\u0E25\u0E32\u0E40\u0E1B\u0E34\u0E14-\u0E1B\u0E34\u0E14)", "description": "\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E27\u0E31\u0E14\u0E41\u0E2B\u0E48\u0E07\u0E41\u0E23\u0E01\u0E02\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1B\u0E35 \u0E1E.\u0E28. 1839 \u0E42\u0E14\u0E22\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E21\u0E2B\u0E32\u0E23\u0E32\u0E0A \u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E1F\u0E23\u0E35 \u0E40\u0E1B\u0E34\u0E14\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19 05:00-19:00 \u0E19. \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E02\u0E49\u0E2D\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22 \u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07 \u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E40\u0E14\u0E48\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E49\u0E32\u0E21\u0E1E\u0E25\u0E32\u0E14", "ogTitle": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 - \u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 (\u0E2A\u0E23\u0E49\u0E32\u0E07 \u0E1E.\u0E28. 1839)", "ogDescription": "\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19: \u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E1F\u0E23\u0E35 \u0E40\u0E27\u0E25\u0E32\u0E40\u0E1B\u0E34\u0E14-\u0E1B\u0E34\u0E14 \u0E01\u0E32\u0E23\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22 \u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E25\u0E49\u0E2D\u0E21 \u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27 \u0E1E\u0E23\u0E30\u0E28\u0E34\u0E25\u0E32 \u0E41\u0E25\u0E30\u0E27\u0E34\u0E18\u0E35\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E08\u0E32\u0E01\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E17\u0E48\u0E32\u0E41\u0E1E" };
    sync$2 = { "time": "\u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19 2026", "reviewsFrom": "\u0E23\u0E35\u0E27\u0E34\u0E27\u0E21\u0E32\u0E08\u0E32\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Google Maps", "viewAll": "\u0E14\u0E39\u0E23\u0E35\u0E27\u0E34\u0E27\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E1A\u0E19 Google Maps", "ratingNote": "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E41\u0E25\u0E30\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E35\u0E27\u0E34\u0E27\u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E08\u0E32\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Google Maps (Google Maps)", "reviewsNote": "\u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E08\u0E32\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Google Maps \u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 \u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19 2026 \u0E25\u0E34\u0E02\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E35\u0E22\u0E19\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A\u0E41\u0E25\u0E30 Google Maps", "reviewsCta": "\u0E14\u0E39\u0E23\u0E35\u0E27\u0E34\u0E27\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E1A\u0E19 Google Maps" };
    imageCopyright$2 = "\u0E20\u0E32\u0E1E\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E17\u0E35\u0E48\u0E41\u0E2A\u0E14\u0E07\u0E1A\u0E19\u0E40\u0E27\u0E47\u0E1A\u0E44\u0E0B\u0E15\u0E4C\u0E19\u0E35\u0E49 \u0E40\u0E1B\u0E47\u0E19\u0E01\u0E23\u0E23\u0E21\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E41\u0E25\u0E30\u0E25\u0E34\u0E02\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E02\u0E2D\u0E07\u0E0A\u0E48\u0E32\u0E07\u0E20\u0E32\u0E1E\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A";
    breadcrumb$2 = { "label": "\u0E40\u0E1A\u0E23\u0E14\u0E04\u0E23\u0E31\u0E21\u0E1A\u0E4C", "items": [{ "name": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19" }, { "name": "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48" }, { "name": "\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48" }, { "name": "\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22" }] };
    header$2 = { "home": "\u0E2B\u0E19\u0E49\u0E32\u0E41\u0E23\u0E01", "about": "\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A", "arch": "\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21", "legends": "\u0E15\u0E33\u0E19\u0E32\u0E19", "history": "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34", "weather": "\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28", "seasons": "\u0E24\u0E14\u0E39\u0E01\u0E32\u0E25", "guide": "\u0E41\u0E19\u0E30\u0E19\u0E33\u0E01\u0E32\u0E23\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27", "routes": "\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07", "itinerary": "\u0E41\u0E1C\u0E19\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27", "food": "\u0E02\u0E2D\u0E07\u0E01\u0E34\u0E19\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07", "gallery": "\u0E41\u0E01\u0E25\u0E40\u0E25\u0E2D\u0E23\u0E35", "facilities": "\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01", "responsibility": "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A", "reviews": "\u0E23\u0E35\u0E27\u0E34\u0E27", "map": "\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48" };
    weather$2 = { "label": "\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E01\u0E32\u0E23\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21", "heading": "\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E02\u0E13\u0E30\u0E19\u0E35\u0E49", "intro": "\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E40\u0E02\u0E15\u0E20\u0E39\u0E21\u0E34\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E1A\u0E1A\u0E17\u0E38\u0E48\u0E07\u0E2B\u0E0D\u0E49\u0E32\u0E2A\u0E30\u0E27\u0E31\u0E19\u0E19\u0E32 \u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19\u0E23\u0E49\u0E2D\u0E19 \u0E21\u0E35\u0E24\u0E14\u0E39\u0E1D\u0E19\u0E0A\u0E31\u0E14\u0E40\u0E08\u0E19 \u0E41\u0E25\u0E30\u0E21\u0E35\u0E0A\u0E48\u0E27\u0E07\u0E2B\u0E21\u0E2D\u0E01\u0E04\u0E27\u0E31\u0E19\u0E1B\u0E25\u0E32\u0E22\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E19\u0E32\u0E27 \u0E04\u0E27\u0E23\u0E40\u0E0A\u0E47\u0E01\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E01\u0E48\u0E2D\u0E19\u0E2D\u0E2D\u0E01\u0E40\u0E14\u0E34\u0E19\u0E40\u0E17\u0E49\u0E32", "nowLabel": "\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19", "feelsLike": "\u0E23\u0E39\u0E49\u0E2A\u0E36\u0E01\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19", "humidity": "\u0E04\u0E27\u0E32\u0E21\u0E0A\u0E37\u0E49\u0E19", "wind": "\u0E25\u0E21", "windUnit": "\u0E01\u0E21./\u0E0A\u0E21.", "rainChance": "\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E1D\u0E19\u0E15\u0E01\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49", "umbrellaTitle": "\u0E15\u0E49\u0E2D\u0E07\u0E1E\u0E01\u0E23\u0E48\u0E21\u0E44\u0E2B\u0E21?", "umbrellaYes": "\u0E04\u0E27\u0E23\u0E1E\u0E01 \u2014 \u0E27\u0E31\u0E19\u0E19\u0E35\u0E49\u0E21\u0E35\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E1D\u0E19\u0E15\u0E01 \u0E23\u0E48\u0E21\u0E1E\u0E01\u0E1E\u0E32\u0E22\u0E31\u0E07\u0E43\u0E0A\u0E49\u0E1A\u0E31\u0E07\u0E41\u0E14\u0E14\u0E44\u0E14\u0E49 \u0E0B\u0E36\u0E48\u0E07\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E01\u0E27\u0E48\u0E32\u0E01\u0E31\u0E19\u0E1D\u0E19\u0E43\u0E19\u0E24\u0E14\u0E39\u0E23\u0E49\u0E2D\u0E19", "umbrellaNo": "\u0E44\u0E21\u0E48\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19 \u2014 \u0E04\u0E32\u0E14\u0E27\u0E48\u0E32\u0E41\u0E17\u0E1A\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1D\u0E19 \u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E1E\u0E01\u0E04\u0E37\u0E2D\u0E2B\u0E21\u0E27\u0E01 \u0E19\u0E49\u0E33\u0E14\u0E37\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E1B\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E19\u0E41\u0E14\u0E14", "observedLabel": "\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E15\u0E23\u0E27\u0E08\u0E27\u0E31\u0E14", "placeLabel": "\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07", "forecastTitle": "\u0E1E\u0E22\u0E32\u0E01\u0E23\u0E13\u0E4C 7 \u0E27\u0E31\u0E19\u0E02\u0E49\u0E32\u0E07\u0E2B\u0E19\u0E49\u0E32", "forecastDays": "\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14/\u0E15\u0E48\u0E33\u0E2A\u0E38\u0E14\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19 \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E1D\u0E19\u0E15\u0E01", "todayLabel": "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49", "forecastNote": "\u0E04\u0E48\u0E32\u0E1E\u0E22\u0E32\u0E01\u0E23\u0E13\u0E4C\u0E04\u0E33\u0E19\u0E27\u0E13\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E43\u0E19\u0E24\u0E14\u0E39\u0E1D\u0E19\u0E1D\u0E19\u0E21\u0E31\u0E01\u0E15\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E1A\u0E48\u0E32\u0E22\u0E41\u0E25\u0E30\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E1B\u0E20\u0E32\u0E22\u0E43\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07", "unavailable": "\u0E02\u0E13\u0E30\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E2A\u0E14\u0E44\u0E14\u0E49 \u0E14\u0E39\u0E20\u0E32\u0E1E\u0E23\u0E27\u0E21\u0E23\u0E32\u0E22\u0E1B\u0E35\u0E44\u0E14\u0E49\u0E43\u0E19\u0E15\u0E32\u0E23\u0E32\u0E07\u0E24\u0E14\u0E39\u0E01\u0E32\u0E25\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07", "codes": { "clear": "\u0E17\u0E49\u0E2D\u0E07\u0E1F\u0E49\u0E32\u0E42\u0E1B\u0E23\u0E48\u0E07", "mainlyClear": "\u0E2A\u0E48\u0E27\u0E19\u0E43\u0E2B\u0E0D\u0E48\u0E42\u0E1B\u0E23\u0E48\u0E07", "partly": "\u0E21\u0E35\u0E40\u0E21\u0E06\u0E1A\u0E32\u0E07\u0E2A\u0E48\u0E27\u0E19", "overcast": "\u0E40\u0E21\u0E06\u0E21\u0E32\u0E01", "fog": "\u0E2B\u0E21\u0E2D\u0E01", "drizzle": "\u0E1D\u0E19\u0E1B\u0E23\u0E2D\u0E22", "rain": "\u0E1D\u0E19\u0E15\u0E01", "showers": "\u0E1D\u0E19\u0E15\u0E01\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E30\u0E22\u0E30", "snow": "\u0E2B\u0E34\u0E21\u0E30", "storm": "\u0E1E\u0E32\u0E22\u0E38\u0E1D\u0E19\u0E1F\u0E49\u0E32\u0E04\u0E30\u0E19\u0E2D\u0E07" }, "uv": "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E22\u0E39\u0E27\u0E35", "humidityPlain": "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E39\u0E49\u0E2A\u0E36\u0E01\u0E0A\u0E37\u0E49\u0E19", "windPlain": "\u0E25\u0E21", "levels": { "humidity": { "muggy": "\u0E40\u0E2B\u0E19\u0E2D\u0E30\u0E2B\u0E19\u0E30", "humid": "\u0E0A\u0E37\u0E49\u0E19", "comfy": "\u0E2A\u0E1A\u0E32\u0E22", "dry": "\u0E41\u0E2B\u0E49\u0E07" }, "humidityNote": { "muggy": "\u0E40\u0E2B\u0E07\u0E37\u0E48\u0E2D\u0E23\u0E30\u0E1A\u0E32\u0E22\u0E22\u0E32\u0E01", "humid": "\u0E23\u0E39\u0E49\u0E2A\u0E36\u0E01\u0E23\u0E49\u0E2D\u0E19\u0E01\u0E27\u0E48\u0E32\u0E17\u0E35\u0E48\u0E2D\u0E48\u0E32\u0E19\u0E44\u0E14\u0E49", "comfy": "\u0E2A\u0E1A\u0E32\u0E22\u0E1C\u0E34\u0E27", "dry": "\u0E08\u0E34\u0E1A\u0E19\u0E49\u0E33\u0E1A\u0E48\u0E2D\u0E22\u0E46" }, "uv": { "low": "\u0E15\u0E48\u0E33", "moderate": "\u0E1B\u0E32\u0E19\u0E01\u0E25\u0E32\u0E07", "high": "\u0E04\u0E48\u0E2D\u0E19\u0E02\u0E49\u0E32\u0E07\u0E41\u0E23\u0E07", "veryHigh": "\u0E41\u0E23\u0E07", "extreme": "\u0E41\u0E23\u0E07\u0E21\u0E32\u0E01" }, "wind": { "calm": "\u0E25\u0E21\u0E40\u0E1A\u0E32", "breeze": "\u0E21\u0E35\u0E25\u0E21", "strong": "\u0E25\u0E21\u0E41\u0E23\u0E07", "gale": "\u0E25\u0E21\u0E08\u0E31\u0E14" } }, "advice": { "auto": "\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E08\u0E32\u0E01\u0E1E\u0E22\u0E32\u0E01\u0E23\u0E13\u0E4C\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19 \u0E41\u0E2A\u0E14\u0E07\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E40\u0E02\u0E49\u0E32\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E0A\u0E47\u0E01\u0E1E\u0E22\u0E32\u0E01\u0E23\u0E13\u0E4C\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14\u0E01\u0E48\u0E2D\u0E19\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01", "none": "\u0E02\u0E13\u0E30\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E14\u0E49\u0E32\u0E19\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E23\u0E30\u0E27\u0E31\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E1E\u0E34\u0E40\u0E28\u0E29", "blocks": { "alert": "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E23\u0E23\u0E30\u0E27\u0E31\u0E07", "dress": "\u0E01\u0E32\u0E23\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22", "plan": "\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27", "gear": "\u0E02\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E1E\u0E01", "best": "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30" }, "alert": { "storm": "\u0E21\u0E35\u0E1E\u0E32\u0E22\u0E38\u0E1D\u0E19\u0E1F\u0E49\u0E32\u0E04\u0E30\u0E19\u0E2D\u0E07 \u0E2B\u0E25\u0E35\u0E01\u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E17\u0E35\u0E48\u0E42\u0E25\u0E48\u0E07 \u0E43\u0E15\u0E49\u0E15\u0E49\u0E19\u0E44\u0E21\u0E49\u0E43\u0E2B\u0E0D\u0E48 \u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E0A\u0E21\u0E27\u0E34\u0E27\u0E2A\u0E39\u0E07", "heavyRain": "\u0E1D\u0E19\u0E15\u0E01\u0E2B\u0E19\u0E31\u0E01 \u0E2B\u0E25\u0E35\u0E01\u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E16\u0E19\u0E19\u0E15\u0E48\u0E33 \u0E19\u0E49\u0E33\u0E17\u0E48\u0E27\u0E21\u0E02\u0E31\u0E07 \u0E41\u0E25\u0E30\u0E23\u0E34\u0E21\u0E04\u0E25\u0E2D\u0E07", "heat": "\u0E23\u0E49\u0E2D\u0E19\u0E08\u0E31\u0E14\u0E41\u0E25\u0E30\u0E40\u0E2B\u0E19\u0E2D\u0E30\u0E2B\u0E19\u0E30\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07 \u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E21\u0E41\u0E14\u0E14 \u0E04\u0E27\u0E23\u0E25\u0E14\u0E40\u0E27\u0E25\u0E32\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07", "wind": "\u0E25\u0E21\u0E41\u0E23\u0E07 \u0E2B\u0E25\u0E35\u0E01\u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E1B\u0E49\u0E32\u0E22 \u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27 \u0E41\u0E25\u0E30\u0E01\u0E34\u0E48\u0E07\u0E44\u0E21\u0E49\u0E41\u0E2B\u0E49\u0E07", "fog": "\u0E17\u0E31\u0E28\u0E19\u0E27\u0E34\u0E2A\u0E31\u0E22\u0E44\u0E21\u0E48\u0E14\u0E35 \u0E02\u0E31\u0E1A\u0E23\u0E16\u0E2B\u0E23\u0E37\u0E2D\u0E02\u0E35\u0E48\u0E21\u0E2D\u0E40\u0E15\u0E2D\u0E23\u0E4C\u0E44\u0E0B\u0E04\u0E4C\u0E43\u0E2B\u0E49\u0E0A\u0E49\u0E32\u0E25\u0E07" }, "dress": { "storm": "\u0E43\u0E2A\u0E48\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32\u0E41\u0E2B\u0E49\u0E07\u0E40\u0E23\u0E47\u0E27\u0E41\u0E25\u0E30\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E01\u0E31\u0E19\u0E25\u0E37\u0E48\u0E19 \u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E01\u0E23\u0E30\u0E42\u0E1B\u0E23\u0E07\u0E22\u0E32\u0E27\u0E41\u0E25\u0E30\u0E01\u0E32\u0E07\u0E40\u0E01\u0E07\u0E02\u0E32\u0E01\u0E27\u0E49\u0E32\u0E07", "heavyRain": "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E01\u0E31\u0E19\u0E1D\u0E19\u0E01\u0E31\u0E1A\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E01\u0E31\u0E19\u0E25\u0E37\u0E48\u0E19 \u0E23\u0E48\u0E21\u0E04\u0E31\u0E19\u0E22\u0E32\u0E27\u0E44\u0E21\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E01\u0E31\u0E1A\u0E25\u0E21\u0E41\u0E23\u0E07", "rainLikely": "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32\u0E41\u0E2B\u0E49\u0E07\u0E40\u0E23\u0E47\u0E27 \u0E41\u0E25\u0E30\u0E1E\u0E01\u0E23\u0E48\u0E21\u0E1E\u0E01\u0E1E\u0E32\u0E44\u0E27\u0E49\u0E43\u0E19\u0E01\u0E23\u0E30\u0E40\u0E1B\u0E4B\u0E32", "lightRain": "\u0E1D\u0E19\u0E15\u0E01\u0E1B\u0E23\u0E2D\u0E22 \u0E23\u0E30\u0E27\u0E31\u0E07\u0E40\u0E17\u0E49\u0E32\u0E25\u0E37\u0E48\u0E19\u0E1A\u0E19\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E34\u0E19\u0E40\u0E1B\u0E35\u0E22\u0E01", "hot": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E49\u0E2D\u0E19 \u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32\u0E1A\u0E32\u0E07\u0E40\u0E1A\u0E32\u0E23\u0E30\u0E1A\u0E32\u0E22\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E49\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14", "heat": "\u0E43\u0E2A\u0E48\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E2A\u0E35\u0E2D\u0E48\u0E2D\u0E19\u0E2B\u0E25\u0E27\u0E21\u0E46 \u0E43\u0E2B\u0E49\u0E23\u0E48\u0E32\u0E07\u0E01\u0E32\u0E22\u0E23\u0E30\u0E1A\u0E32\u0E22\u0E04\u0E27\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E19\u0E44\u0E14\u0E49", "uv": "\u0E41\u0E14\u0E14\u0E41\u0E23\u0E07 \u0E43\u0E0A\u0E49\u0E2B\u0E21\u0E27\u0E01 \u0E41\u0E27\u0E48\u0E19\u0E15\u0E32\u0E41\u0E14\u0E14 \u0E41\u0E25\u0E30\u0E04\u0E23\u0E35\u0E21\u0E01\u0E31\u0E19\u0E41\u0E14\u0E14", "uvExtreme": "\u0E23\u0E31\u0E07\u0E2A\u0E35\u0E22\u0E39\u0E27\u0E35\u0E41\u0E23\u0E07\u0E21\u0E32\u0E01 \u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E41\u0E02\u0E19\u0E22\u0E32\u0E27\u0E1A\u0E32\u0E07\u0E46 \u0E01\u0E31\u0E1A\u0E2B\u0E21\u0E27\u0E01\u0E0A\u0E48\u0E27\u0E22\u0E44\u0E14\u0E49\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E04\u0E23\u0E35\u0E21\u0E01\u0E31\u0E19\u0E41\u0E14\u0E14", "swing": "\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34\u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19\u0E01\u0E25\u0E32\u0E07\u0E04\u0E37\u0E19\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E21\u0E32\u0E01 \u0E1E\u0E01\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1A\u0E32\u0E07\u0E46 \u0E44\u0E27\u0E49\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2B\u0E23\u0E37\u0E2D\u0E16\u0E2D\u0E14", "cold": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E2B\u0E19\u0E32\u0E27 \u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E42\u0E04\u0E49\u0E17\u0E2B\u0E19\u0E32\u0E41\u0E25\u0E30\u0E1C\u0E49\u0E32\u0E1E\u0E31\u0E19\u0E04\u0E2D\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19", "wind": "\u0E25\u0E21\u0E41\u0E23\u0E07 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E21\u0E27\u0E01\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E1B\u0E25\u0E34\u0E27\u0E07\u0E48\u0E32\u0E22", "wind7": "\u0E25\u0E21\u0E08\u0E31\u0E14 \u0E43\u0E2A\u0E48\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E01\u0E31\u0E19\u0E25\u0E21\u0E41\u0E25\u0E30\u0E23\u0E31\u0E01\u0E29\u0E32\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E1A\u0E2D\u0E38\u0E48\u0E19", "ok": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E1B\u0E01\u0E15\u0E34 \u0E43\u0E2A\u0E48\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1C\u0E49\u0E32\u0E1A\u0E32\u0E07\u0E40\u0E1A\u0E32\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E1B\u0E01\u0E15\u0E34 \u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E40\u0E02\u0E49\u0E32\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E04\u0E27\u0E23\u0E43\u0E2A\u0E48\u0E16\u0E38\u0E07\u0E40\u0E17\u0E49\u0E32" }, "plan": { "storm": "\u0E2B\u0E25\u0E1A\u0E1D\u0E19\u0E43\u0E19\u0E2D\u0E32\u0E04\u0E32\u0E23\u0E08\u0E19\u0E01\u0E27\u0E48\u0E32\u0E08\u0E30\u0E0B\u0E32 \u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E17\u0E32\u0E07\u0E19\u0E49\u0E33\u0E41\u0E25\u0E30\u0E17\u0E35\u0E48\u0E2A\u0E39\u0E07\u0E21\u0E31\u0E01\u0E1B\u0E34\u0E14", "heavyRain": "\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E19\u0E38\u0E01 \u0E40\u0E19\u0E49\u0E19\u0E08\u0E38\u0E14\u0E43\u0E19\u0E23\u0E48\u0E21\u0E41\u0E25\u0E30\u0E17\u0E32\u0E07\u0E40\u0E14\u0E34\u0E19\u0E21\u0E35\u0E2B\u0E25\u0E31\u0E07\u0E04\u0E32", "rainLikely": "\u0E21\u0E35\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E1D\u0E19\u0E15\u0E01 \u0E08\u0E31\u0E14\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07\u0E44\u0E27\u0E49\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E0A\u0E49\u0E32 \u0E1D\u0E19\u0E1A\u0E48\u0E32\u0E22\u0E21\u0E31\u0E01\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E1B\u0E43\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07", "lightRain": "\u0E1D\u0E19\u0E1B\u0E23\u0E2D\u0E22\u0E44\u0E21\u0E48\u0E40\u0E2A\u0E35\u0E22\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E41\u0E2A\u0E07\u0E19\u0E38\u0E48\u0E21\u0E16\u0E48\u0E32\u0E22\u0E23\u0E39\u0E1B\u0E2A\u0E27\u0E22", "hot": "\u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E01\u0E32\u0E23\u0E2D\u0E22\u0E39\u0E48\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07\u0E0A\u0E48\u0E27\u0E07 11:00\u201315:00 \u0E19. \u0E1E\u0E31\u0E01\u0E43\u0E19\u0E23\u0E48\u0E21\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E27\u0E31\u0E19", "heat": "\u0E40\u0E14\u0E34\u0E19\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E0A\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E22\u0E47\u0E19 \u0E0A\u0E48\u0E27\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E43\u0E19\u0E23\u0E48\u0E21", "muggy": "\u0E0A\u0E37\u0E49\u0E19\u0E40\u0E2B\u0E19\u0E2D\u0E30\u0E2B\u0E19\u0E30 \u0E40\u0E2B\u0E07\u0E37\u0E48\u0E2D\u0E23\u0E30\u0E1A\u0E32\u0E22\u0E22\u0E32\u0E01 \u0E0A\u0E30\u0E25\u0E2D\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E30\u0E41\u0E25\u0E30\u0E14\u0E37\u0E48\u0E21\u0E19\u0E49\u0E33\u0E21\u0E32\u0E01\u0E02\u0E36\u0E49\u0E19", "uv": "\u0E40\u0E14\u0E34\u0E19\u0E1D\u0E31\u0E48\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E23\u0E48\u0E21\u0E40\u0E07\u0E32 \u0E2B\u0E25\u0E35\u0E01\u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E01\u0E25\u0E32\u0E07\u0E25\u0E32\u0E19\u0E42\u0E25\u0E48\u0E07\u0E19\u0E32\u0E19\u0E46", "wind": "\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07\u0E2D\u0E32\u0E08\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E1C\u0E25\u0E01\u0E23\u0E30\u0E17\u0E1A \u0E04\u0E27\u0E23\u0E40\u0E1C\u0E37\u0E48\u0E2D\u0E40\u0E27\u0E25\u0E32\u0E44\u0E27\u0E49", "wind7": "\u0E01\u0E34\u0E08\u0E01\u0E23\u0E23\u0E21\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07\u0E19\u0E48\u0E32\u0E08\u0E30\u0E1B\u0E34\u0E14 \u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E43\u0E19\u0E23\u0E48\u0E21\u0E14\u0E35\u0E01\u0E27\u0E48\u0E32", "sunny": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E14\u0E35 \u0E40\u0E2B\u0E21\u0E32\u0E30\u0E01\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07 \u0E41\u0E2A\u0E07\u0E2A\u0E27\u0E22\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E0A\u0E49\u0E32\u0E41\u0E25\u0E30\u0E40\u0E22\u0E47\u0E19", "cloudy": "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E41\u0E14\u0E14\u0E08\u0E31\u0E14 \u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E01\u0E25\u0E32\u0E07\u0E41\u0E08\u0E49\u0E07\u0E44\u0E14\u0E49\u0E22\u0E32\u0E27\u0E17\u0E31\u0E49\u0E07\u0E27\u0E31\u0E19", "fog": "\u0E27\u0E34\u0E27\u0E44\u0E01\u0E25\u0E44\u0E21\u0E48\u0E0A\u0E31\u0E14 \u0E40\u0E2B\u0E21\u0E32\u0E30\u0E01\u0E31\u0E1A\u0E16\u0E48\u0E32\u0E22\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E43\u0E01\u0E25\u0E49\u0E46", "courtyard": "\u0E40\u0E02\u0E49\u0E32\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E15\u0E49\u0E2D\u0E07\u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32 \u0E2B\u0E34\u0E19\u0E25\u0E32\u0E19\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E23\u0E49\u0E2D\u0E19\u0E08\u0E31\u0E14\u0E0A\u0E48\u0E27\u0E07\u0E1A\u0E48\u0E32\u0E22 \u0E2D\u0E22\u0E48\u0E32\u0E22\u0E37\u0E19\u0E40\u0E17\u0E49\u0E32\u0E40\u0E1B\u0E25\u0E48\u0E32\u0E19\u0E32\u0E19", "ok": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E1B\u0E01\u0E15\u0E34 \u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E15\u0E32\u0E21\u0E41\u0E1C\u0E19\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22 \u0E2D\u0E22\u0E48\u0E32\u0E25\u0E37\u0E21\u0E08\u0E34\u0E1A\u0E19\u0E49\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E30\u0E22\u0E30" }, "best": { "morning": "\u0E41\u0E19\u0E30\u0E19\u0E33\u0E2D\u0E2D\u0E01\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27 08:30\u201311:00 \u0E19. \u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E25\u0E31\u0E07 16:00 \u0E19. \u0E40\u0E25\u0E35\u0E48\u0E22\u0E07\u0E17\u0E31\u0E49\u0E07\u0E41\u0E14\u0E14\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07\u0E41\u0E25\u0E30\u0E1D\u0E19\u0E1A\u0E48\u0E32\u0E22", "wait": "\u0E23\u0E2D\u0E1D\u0E19\u0E0B\u0E32\u0E01\u0E48\u0E2D\u0E19\u0E2D\u0E2D\u0E01\u0E08\u0E32\u0E01\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01 \u0E40\u0E23\u0E34\u0E48\u0E21\u0E08\u0E32\u0E01\u0E08\u0E38\u0E14\u0E43\u0E19\u0E23\u0E48\u0E21\u0E44\u0E1B\u0E01\u0E48\u0E2D\u0E19", "any": "\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E44\u0E14\u0E49\u0E17\u0E38\u0E01\u0E0A\u0E48\u0E27\u0E07 \u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E15\u0E32\u0E21\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E30\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22" }, "gear": { "umbrella": "\u0E23\u0E48\u0E21\u0E1E\u0E01\u0E1E\u0E32", "foldingUmbrella": "\u0E23\u0E48\u0E21\u0E1E\u0E01\u0E1E\u0E32", "raincoat": "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E01\u0E31\u0E19\u0E1D\u0E19", "windBreaker": "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E01\u0E31\u0E19\u0E25\u0E21", "shoesGrip": "\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E01\u0E31\u0E19\u0E25\u0E37\u0E48\u0E19", "hat": "\u0E2B\u0E21\u0E27\u0E01\u0E01\u0E31\u0E19\u0E41\u0E14\u0E14", "sunglasses": "\u0E41\u0E27\u0E48\u0E19\u0E15\u0E32\u0E41\u0E14\u0E14", "sunscreen": "\u0E04\u0E23\u0E35\u0E21\u0E01\u0E31\u0E19\u0E41\u0E14\u0E14", "water": "\u0E19\u0E49\u0E33\u0E14\u0E37\u0E48\u0E21", "layer": "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E1A\u0E32\u0E07\u0E46", "thickCoat": "\u0E40\u0E2A\u0E37\u0E49\u0E2D\u0E42\u0E04\u0E49\u0E17\u0E2B\u0E19\u0E32", "scarf": "\u0E1C\u0E49\u0E32\u0E1E\u0E31\u0E19\u0E04\u0E2D", "slipOn": "\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E16\u0E2D\u0E14\u0E07\u0E48\u0E32\u0E22", "socks": "\u0E16\u0E38\u0E07\u0E40\u0E17\u0E49\u0E32", "mask": "\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E32\u0E01" }, "tips": { "storm": "\u0E1E\u0E32\u0E22\u0E38\u0E1D\u0E19", "heavyRain": "\u0E1D\u0E19\u0E2B\u0E19\u0E31\u0E01", "umbrella": "\u0E1E\u0E01\u0E23\u0E48\u0E21", "heat": "\u0E23\u0E49\u0E2D\u0E19\u0E08\u0E31\u0E14", "sun": "\u0E41\u0E14\u0E14\u0E41\u0E23\u0E07", "swing": "\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34\u0E15\u0E48\u0E32\u0E07\u0E01\u0E31\u0E19\u0E21\u0E32\u0E01", "fog": "\u0E17\u0E31\u0E28\u0E19\u0E27\u0E34\u0E2A\u0E31\u0E22\u0E15\u0E48\u0E33", "comfy": "\u0E2A\u0E1A\u0E32\u0E22" } } };
    seasons$2 = { "label": "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E21\u0E32\u0E30", "heading": "\u0E01\u0E25\u0E22\u0E38\u0E17\u0E18\u0E4C\u0E01\u0E32\u0E23\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E23\u0E32\u0E22\u0E24\u0E14\u0E39\u0E01\u0E32\u0E25", "intro": "\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E21\u0E35\u0E2A\u0E32\u0E21\u0E24\u0E14\u0E39\u0E17\u0E35\u0E48\u0E0A\u0E31\u0E14\u0E40\u0E08\u0E19 \u0E41\u0E25\u0E30\u0E21\u0E35\u0E0A\u0E48\u0E27\u0E07\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E0A\u0E48\u0E27\u0E07\u0E17\u0E35\u0E48\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E01\u0E27\u0E48\u0E32\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34 \u0E15\u0E32\u0E23\u0E32\u0E07\u0E19\u0E35\u0E49\u0E23\u0E27\u0E1A\u0E23\u0E27\u0E21\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34 \u0E1B\u0E23\u0E34\u0E21\u0E32\u0E13\u0E1D\u0E19 \u0E2B\u0E21\u0E2D\u0E01\u0E04\u0E27\u0E31\u0E19 \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E19\u0E32\u0E41\u0E19\u0E48\u0E19\u0E02\u0E2D\u0E07\u0E19\u0E31\u0E01\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32", "climateNote": "\u0E04\u0E48\u0E32\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E34\u0E21\u0E32\u0E13\u0E19\u0E49\u0E33\u0E1D\u0E19\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E04\u0E48\u0E32\u0E1B\u0E01\u0E15\u0E34\u0E21\u0E32\u0E15\u0E23\u0E10\u0E32\u0E19 WMO 1991\u20132020 \u0E02\u0E2D\u0E07\u0E2A\u0E16\u0E32\u0E19\u0E35\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E0A\u0E48\u0E27\u0E07\u0E2B\u0E21\u0E2D\u0E01\u0E04\u0E27\u0E31\u0E19\u0E2A\u0E30\u0E17\u0E49\u0E2D\u0E19\u0E24\u0E14\u0E39\u0E01\u0E32\u0E23\u0E40\u0E1C\u0E32\u0E43\u0E19\u0E20\u0E32\u0E04\u0E01\u0E32\u0E23\u0E40\u0E01\u0E29\u0E15\u0E23\u0E02\u0E2D\u0E07\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14\u0E20\u0E32\u0E04\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E43\u0E19\u0E0A\u0E48\u0E27\u0E07\u0E01\u0E38\u0E21\u0E20\u0E32\u0E1E\u0E31\u0E19\u0E18\u0E4C\u2013\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19", "columns": ["\u0E24\u0E14\u0E39", "\u0E40\u0E14\u0E37\u0E2D\u0E19", "\u0E2D\u0E38\u0E13\u0E2B\u0E20\u0E39\u0E21\u0E34", "\u0E1B\u0E23\u0E34\u0E21\u0E32\u0E13\u0E1D\u0E19", "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E25\u0E30\u0E1C\u0E39\u0E49\u0E04\u0E19", "\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19"], "rows": [{ "season": "\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E19\u0E32\u0E27\u0E41\u0E2B\u0E49\u0E07", "months": "\u0E1E.\u0E22. \u2013 \u0E01.\u0E1E.", "temp": "14 \u2013 30 \xB0C", "rain": "\u0E19\u0E49\u0E2D\u0E22\u0E21\u0E32\u0E01 (\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 30 \u0E21\u0E21./\u0E40\u0E14\u0E37\u0E2D\u0E19)", "air": "\u0E40\u0E0A\u0E49\u0E32\u0E42\u0E1B\u0E23\u0E48\u0E07 \u0E19\u0E31\u0E01\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E21\u0E32\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14", "advice": "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E42\u0E14\u0E22\u0E23\u0E27\u0E21 \u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19\u0E2D\u0E1A\u0E2D\u0E38\u0E48\u0E19 \u0E40\u0E22\u0E47\u0E19\u0E2A\u0E1A\u0E32\u0E22 \u0E04\u0E27\u0E23\u0E08\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01\u0E25\u0E48\u0E27\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E18\u0E31\u0E19\u0E27\u0E32\u0E04\u0E21\u2013\u0E21\u0E01\u0E23\u0E32\u0E04\u0E21 \u0E41\u0E25\u0E30\u0E21\u0E32\u0E16\u0E36\u0E07\u0E01\u0E48\u0E2D\u0E19 09:00 \u0E19. \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E41\u0E1A\u0E1A\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E2A\u0E07\u0E1A" }, { "season": "\u0E2B\u0E21\u0E2D\u0E01\u0E04\u0E27\u0E31\u0E19", "months": "\u0E01.\u0E1E. \u2013 \u0E40\u0E21.\u0E22.", "temp": "18 \u2013 38 \xB0C", "rain": "\u0E19\u0E49\u0E2D\u0E22\u0E21\u0E32\u0E01", "air": "PM2.5 \u0E21\u0E31\u0E01\u0E2A\u0E39\u0E07 \u0E2B\u0E21\u0E2D\u0E01\u0E04\u0E27\u0E31\u0E19\u0E0A\u0E48\u0E27\u0E07\u0E1A\u0E48\u0E32\u0E22", "advice": "\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E0A\u0E49\u0E32\u0E15\u0E23\u0E39\u0E48 \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2D\u0E2B\u0E25\u0E31\u0E07\u0E1D\u0E19\u0E41\u0E23\u0E01\u0E1B\u0E25\u0E32\u0E22\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19 \u0E1C\u0E39\u0E49\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E23\u0E30\u0E1A\u0E1A\u0E17\u0E32\u0E07\u0E40\u0E14\u0E34\u0E19\u0E2B\u0E32\u0E22\u0E43\u0E08\u0E04\u0E27\u0E23\u0E40\u0E0A\u0E47\u0E01\u0E14\u0E31\u0E0A\u0E19\u0E35\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19" }, { "season": "\u0E23\u0E49\u0E2D\u0E19", "months": "\u0E21\u0E35.\u0E04. \u2013 \u0E1E.\u0E04.", "temp": "24 \u2013 40 \xB0C", "rain": "\u0E19\u0E49\u0E2D\u0E22 \u0E21\u0E35\u0E1E\u0E32\u0E22\u0E38\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E23\u0E31\u0E49\u0E07\u0E04\u0E23\u0E32\u0E27", "air": "\u0E41\u0E2A\u0E07\u0E08\u0E31\u0E14 \u0E19\u0E31\u0E01\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E19\u0E49\u0E2D\u0E22\u0E25\u0E07", "advice": "\u0E08\u0E31\u0E14\u0E40\u0E27\u0E25\u0E32\u0E40\u0E02\u0E49\u0E32\u0E27\u0E31\u0E14\u0E01\u0E48\u0E2D\u0E19 10:00 \u0E19. \u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E25\u0E31\u0E07 16:00 \u0E19. \u0E1E\u0E01\u0E19\u0E49\u0E33 \u0E43\u0E0A\u0E49\u0E23\u0E48\u0E21\u0E40\u0E07\u0E32\u0E43\u0E19\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14 \u0E41\u0E25\u0E30\u0E23\u0E30\u0E27\u0E31\u0E07\u0E1E\u0E37\u0E49\u0E19\u0E2B\u0E34\u0E19\u0E17\u0E35\u0E48\u0E23\u0E49\u0E2D\u0E19\u0E08\u0E31\u0E14\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07" }, { "season": "\u0E1D\u0E19", "months": "\u0E21\u0E34.\u0E22. \u2013 \u0E15.\u0E04.", "temp": "23 \u2013 33 \xB0C", "rain": "\u0E1D\u0E19\u0E15\u0E01\u0E2B\u0E19\u0E31\u0E01\u0E1A\u0E48\u0E2D\u0E22\u0E0A\u0E48\u0E27\u0E07\u0E1A\u0E48\u0E32\u0E22", "air": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E2A\u0E30\u0E2D\u0E32\u0E14\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E1B\u0E35 \u0E27\u0E31\u0E14\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14", "advice": "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E0A\u0E49\u0E32\u0E21\u0E31\u0E01\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1D\u0E19\u0E41\u0E25\u0E30\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E41\u0E17\u0E1A\u0E27\u0E48\u0E32\u0E07\u0E40\u0E1B\u0E25\u0E48\u0E32 \u0E04\u0E32\u0E14\u0E27\u0E48\u0E32\u0E08\u0E30\u0E21\u0E35\u0E1D\u0E19\u0E2B\u0E19\u0E31\u0E01\u0E41\u0E15\u0E48\u0E2A\u0E31\u0E49\u0E19\u0E2B\u0E25\u0E31\u0E07 15:00 \u0E19. \u0E2B\u0E34\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E35\u0E22\u0E01\u0E41\u0E25\u0E30\u0E40\u0E21\u0E06\u0E15\u0E48\u0E33\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E24\u0E14\u0E39\u0E17\u0E35\u0E48\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E2A\u0E27\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14" }], "tip": "\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E24\u0E14\u0E39\u0E43\u0E14 \u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E0A\u0E49\u0E32\u0E21\u0E32\u0E01 \u0E2A\u0E2D\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07\u0E2B\u0E25\u0E31\u0E07\u0E1E\u0E23\u0E30\u0E2D\u0E32\u0E17\u0E34\u0E15\u0E22\u0E4C\u0E02\u0E36\u0E49\u0E19\u0E43\u0E2B\u0E49\u0E41\u0E2A\u0E07\u0E19\u0E38\u0E48\u0E21 \u0E2D\u0E32\u0E01\u0E32\u0E28\u0E40\u0E22\u0E47\u0E19 \u0E41\u0E25\u0E30\u0E1C\u0E39\u0E49\u0E04\u0E19\u0E19\u0E49\u0E2D\u0E22\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14" };
    routes$2 = { "label": "\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E15\u0E32\u0E21\u0E1C\u0E39\u0E49\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07", "heading": "\u0E2A\u0E32\u0E21\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E2A\u0E32\u0E21\u0E41\u0E1A\u0E1A", "intro": "\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14\u0E21\u0E35\u0E02\u0E19\u0E32\u0E14\u0E01\u0E30\u0E17\u0E31\u0E14\u0E23\u0E31\u0E14 \u0E04\u0E27\u0E32\u0E21\u0E41\u0E15\u0E01\u0E15\u0E48\u0E32\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07\u0E08\u0E36\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E17\u0E35\u0E48\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E30\u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E2A\u0E19\u0E43\u0E08 \u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32\u0E23\u0E30\u0E22\u0E30\u0E17\u0E32\u0E07 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E43\u0E2B\u0E49\u0E40\u0E2B\u0E21\u0E32\u0E30\u0E01\u0E31\u0E1A\u0E04\u0E19\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E21\u0E32\u0E14\u0E49\u0E27\u0E22", "audiences": [{ "tag": "01", "title": "\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E23\u0E31\u0E27\u0E17\u0E35\u0E48\u0E21\u0E35\u0E40\u0E14\u0E47\u0E01", "meta": "45 \u2013 60 \u0E19\u0E32\u0E17\u0E35 \xB7 \u0E40\u0E02\u0E47\u0E19\u0E23\u0E16\u0E40\u0E02\u0E47\u0E19\u0E40\u0E14\u0E47\u0E01\u0E44\u0E14\u0E49", "text": "\u0E40\u0E02\u0E49\u0E32\u0E17\u0E32\u0E07\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22 \u0E44\u0E1B\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E38\u0E14\u0E41\u0E23\u0E01 \u2014 \u0E40\u0E14\u0E47\u0E01\u0E21\u0E31\u0E01\u0E2A\u0E31\u0E07\u0E40\u0E01\u0E15\u0E0A\u0E49\u0E32\u0E07\u0E2B\u0E34\u0E19\u0E01\u0E48\u0E2D\u0E19\u0E22\u0E2D\u0E14\u0E17\u0E2D\u0E07 \u0E08\u0E32\u0E01\u0E19\u0E31\u0E49\u0E19\u0E1E\u0E31\u0E01\u0E43\u0E15\u0E49\u0E23\u0E48\u0E21\u0E44\u0E21\u0E49\u0E43\u0E19\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14 \u0E41\u0E25\u0E30\u0E08\u0E1A\u0E17\u0E35\u0E48\u0E23\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E07\u0E2D\u0E38\u0E42\u0E1A\u0E2A\u0E16", "stops": ["\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E23\u0E48\u0E21\u0E04\u0E23\u0E36\u0E49\u0E21", "\u0E23\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E07\u0E2D\u0E38\u0E42\u0E1A\u0E2A\u0E16"] }, { "tag": "02", "title": "\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21", "meta": "90 \u2013 120 \u0E19\u0E32\u0E17\u0E35 \xB7 \u0E0A\u0E48\u0E27\u0E07\u0E17\u0E35\u0E48\u0E14\u0E35 07:00 \u2013 09:00 \u0E19.", "text": "\u0E40\u0E14\u0E34\u0E19\u0E15\u0E32\u0E21\u0E40\u0E02\u0E47\u0E21\u0E19\u0E32\u0E2C\u0E34\u0E01\u0E32\u0E08\u0E32\u0E01\u0E27\u0E34\u0E2B\u0E32\u0E23 \u0E1A\u0E31\u0E19\u0E44\u0E14\u0E19\u0E32\u0E04 \u0E27\u0E34\u0E2B\u0E32\u0E23\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01 \u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E43\u0E19\u0E41\u0E2A\u0E07\u0E40\u0E09\u0E35\u0E22\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E44\u0E1B\u0E2B\u0E2D\u0E44\u0E15\u0E23 \u0E0A\u0E48\u0E27\u0E07\u0E1A\u0E48\u0E32\u0E22\u0E41\u0E01\u0E48\u0E46 \u0E08\u0E30\u0E44\u0E14\u0E49\u0E41\u0E2A\u0E07\u0E2D\u0E38\u0E48\u0E19\u0E1A\u0E19\u0E25\u0E27\u0E14\u0E25\u0E32\u0E22\u0E17\u0E2D\u0E07", "stops": ["\u0E1A\u0E31\u0E19\u0E44\u0E14\u0E19\u0E32\u0E04", "\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01", "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "\u0E2B\u0E2D\u0E44\u0E15\u0E23"] }, { "tag": "03", "title": "\u0E43\u0E0A\u0E49\u0E41\u0E23\u0E07\u0E19\u0E49\u0E2D\u0E22 / \u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E31\u0E49\u0E19\u0E1A\u0E31\u0E19\u0E44\u0E14", "meta": "30 \u2013 45 \u0E19\u0E32\u0E17\u0E35 \xB7 \u0E1E\u0E37\u0E49\u0E19\u0E23\u0E32\u0E1A\u0E40\u0E01\u0E37\u0E2D\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", "text": "\u0E17\u0E32\u0E07\u0E40\u0E02\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E08\u0E32\u0E01\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22\u0E40\u0E1B\u0E47\u0E19\u0E1E\u0E37\u0E49\u0E19\u0E23\u0E32\u0E1A \u0E40\u0E14\u0E34\u0E19\u0E27\u0E19\u0E23\u0E2D\u0E1A\u0E02\u0E2D\u0E1A\u0E25\u0E32\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E23\u0E2D\u0E1A\u0E08\u0E30\u0E40\u0E2B\u0E47\u0E19\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C \u0E14\u0E49\u0E32\u0E19\u0E19\u0E2D\u0E01\u0E2D\u0E38\u0E42\u0E1A\u0E2A\u0E16 \u0E41\u0E25\u0E30\u0E28\u0E32\u0E25\u0E40\u0E2A\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E1A\u0E31\u0E19\u0E44\u0E14 \u0E22\u0E31\u0E07\u0E21\u0E35\u0E02\u0E2D\u0E1A\u0E17\u0E32\u0E07\u0E40\u0E15\u0E35\u0E49\u0E22\u0E1A\u0E32\u0E07\u0E08\u0E38\u0E14", "stops": ["\u0E17\u0E32\u0E07\u0E40\u0E02\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E1E\u0E37\u0E49\u0E19\u0E23\u0E32\u0E1A", "\u0E08\u0E38\u0E14\u0E0A\u0E21\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C", "\u0E14\u0E49\u0E32\u0E19\u0E19\u0E2D\u0E01\u0E2D\u0E38\u0E42\u0E1A\u0E2A\u0E16", "\u0E21\u0E49\u0E32\u0E19\u0E31\u0E48\u0E07\u0E1E\u0E31\u0E01"] }] };
    itinerary$2 = { "label": "\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07\u0E41\u0E19\u0E30\u0E19\u0E33", "heading": "\u0E41\u0E1C\u0E19\u0E04\u0E23\u0E36\u0E48\u0E07\u0E27\u0E31\u0E19\u0E41\u0E25\u0E30\u0E40\u0E15\u0E47\u0E21\u0E27\u0E31\u0E19", "intro": "\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E41\u0E1C\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E17\u0E35\u0E48\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E41\u0E25\u0E30\u0E2D\u0E22\u0E39\u0E48\u0E20\u0E32\u0E22\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E40\u0E14\u0E34\u0E19\u0E40\u0E17\u0E49\u0E32\u0E2B\u0E23\u0E37\u0E2D\u0E19\u0E31\u0E48\u0E07\u0E23\u0E16\u0E2A\u0E31\u0E49\u0E19\u0E46 \u0E40\u0E1E\u0E35\u0E22\u0E07\u0E04\u0E23\u0E31\u0E49\u0E07\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E47\u0E16\u0E36\u0E07", "halfDay": { "title": "\u0E04\u0E23\u0E36\u0E48\u0E07\u0E27\u0E31\u0E19 (\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 3 \u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07)", "summary": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E2A\u0E16\u0E32\u0E19\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07\u0E2A\u0E2D\u0E07\u0E2A\u0E32\u0E21\u0E41\u0E2B\u0E48\u0E07\u0E17\u0E35\u0E48\u0E0A\u0E48\u0E27\u0E22\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E1A\u0E23\u0E34\u0E1A\u0E17", "steps": [{ "time": "08:00", "title": "\u0E16\u0E36\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "text": "\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E40\u0E22\u0E47\u0E19 \u0E41\u0E2A\u0E07\u0E19\u0E38\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E44\u0E14\u0E49\u0E40\u0E2B\u0E47\u0E19\u0E01\u0E34\u0E08\u0E27\u0E31\u0E15\u0E23\u0E22\u0E32\u0E21\u0E40\u0E0A\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E1E\u0E23\u0E30 \u0E40\u0E23\u0E34\u0E48\u0E21\u0E17\u0E35\u0E48\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07" }, { "time": "09:00", "title": "\u0E2D\u0E38\u0E42\u0E1A\u0E2A\u0E16\u0E41\u0E25\u0E30\u0E40\u0E2A\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E40\u0E21\u0E37\u0E2D\u0E07", "text": "\u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E2B\u0E25\u0E31\u0E01 \u0E41\u0E25\u0E49\u0E27\u0E14\u0E39\u0E28\u0E32\u0E25\u0E40\u0E2A\u0E32\u0E2B\u0E25\u0E31\u0E01\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E27\u0E31\u0E14\u0E19\u0E35\u0E49\u0E01\u0E31\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07" }, { "time": "10:00", "title": "\u0E40\u0E14\u0E34\u0E19\u0E25\u0E07\u0E43\u0E15\u0E49\u0E2A\u0E39\u0E48\u0E27\u0E31\u0E14\u0E1E\u0E23\u0E30\u0E2A\u0E34\u0E07\u0E2B\u0E4C", "text": "\u0E40\u0E14\u0E34\u0E19 15 \u0E19\u0E32\u0E17\u0E35\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E01\u0E25\u0E38\u0E48\u0E21\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E2A\u0E16\u0E32\u0E19\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E2D\u0E35\u0E01\u0E41\u0E2B\u0E48\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48" }, { "time": "11:00", "title": "\u0E2D\u0E19\u0E38\u0E2A\u0E32\u0E27\u0E23\u0E35\u0E22\u0E4C\u0E2A\u0E32\u0E21\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C", "text": "\u0E25\u0E32\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E28\u0E32\u0E25\u0E32\u0E01\u0E25\u0E32\u0E07\u0E2B\u0E25\u0E31\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E40\u0E1B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E23\u0E30\u0E25\u0E36\u0E01\u0E16\u0E36\u0E07\u0E1E\u0E31\u0E19\u0E18\u0E21\u0E34\u0E15\u0E23\u0E43\u0E19\u0E01\u0E32\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07" }] }, "fullDay": { "title": "\u0E40\u0E15\u0E47\u0E21\u0E27\u0E31\u0E19 (\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 8 \u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07)", "summary": "\u0E27\u0E31\u0E14 \u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E1E\u0E34\u0E1E\u0E34\u0E18\u0E20\u0E31\u0E13\u0E11\u0E4C \u0E41\u0E25\u0E30\u0E15\u0E25\u0E32\u0E14\u0E22\u0E32\u0E21\u0E40\u0E22\u0E47\u0E19", "steps": [{ "time": "08:00", "title": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "text": "\u0E27\u0E31\u0E14\u0E17\u0E35\u0E48\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E40\u0E07\u0E35\u0E22\u0E1A\u0E2A\u0E07\u0E1A\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E22\u0E32\u0E21\u0E40\u0E0A\u0E49\u0E32" }, { "time": "10:00", "title": "\u0E40\u0E14\u0E34\u0E19\u0E27\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32", "text": "\u0E27\u0E31\u0E14\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2B\u0E25\u0E27\u0E07\u0E41\u0E25\u0E30\u0E27\u0E31\u0E14\u0E1E\u0E23\u0E30\u0E2A\u0E34\u0E07\u0E2B\u0E4C \u0E41\u0E27\u0E30\u0E04\u0E32\u0E40\u0E1F\u0E48\u0E43\u0E19\u0E0B\u0E2D\u0E22\u0E17\u0E32\u0E07\u0E40\u0E14\u0E34\u0E19" }, { "time": "12:30", "title": "\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19\u0E43\u0E01\u0E25\u0E49\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07", "text": "\u0E21\u0E35\u0E23\u0E49\u0E32\u0E19\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E43\u0E2B\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E21\u0E32\u0E01\u0E21\u0E32\u0E22\u0E20\u0E32\u0E22\u0E43\u0E19\u0E44\u0E21\u0E48\u0E01\u0E35\u0E48\u0E0A\u0E48\u0E27\u0E07\u0E15\u0E36\u0E01\u0E08\u0E32\u0E01\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07" }, { "time": "14:00", "title": "\u0E1E\u0E34\u0E1E\u0E34\u0E18\u0E20\u0E31\u0E13\u0E11\u0E4C\u0E41\u0E25\u0E30\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07", "text": "\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E28\u0E34\u0E25\u0E1B\u0E27\u0E31\u0E12\u0E19\u0E18\u0E23\u0E23\u0E21\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E14\u0E34\u0E19\u0E40\u0E25\u0E35\u0E22\u0E1A\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E2D\u0E34\u0E10\u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E2D\u0E22\u0E39\u0E48" }, { "time": "16:30", "title": "\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E0A\u0E21\u0E41\u0E2A\u0E07\u0E40\u0E22\u0E47\u0E19", "text": "\u0E01\u0E25\u0E31\u0E1A\u0E21\u0E32\u0E22\u0E31\u0E07\u0E27\u0E31\u0E14\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E38\u0E4A\u0E1B\u0E17\u0E31\u0E27\u0E23\u0E4C\u0E08\u0E32\u0E01\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27 \u0E2B\u0E34\u0E19\u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E35\u0E17\u0E2D\u0E07" }, { "time": "18:30", "title": "\u0E15\u0E25\u0E32\u0E14\u0E22\u0E32\u0E21\u0E04\u0E48\u0E33", "text": "\u0E15\u0E25\u0E32\u0E14\u0E01\u0E25\u0E32\u0E07\u0E04\u0E37\u0E19\u0E43\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E19\u0E2D\u0E01\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E21\u0E37\u0E49\u0E2D\u0E04\u0E48\u0E33\u0E41\u0E25\u0E30\u0E07\u0E32\u0E19\u0E2B\u0E31\u0E15\u0E16\u0E01\u0E23\u0E23\u0E21\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19" }] } };
    facilities$2 = { "label": "\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1C\u0E39\u0E49\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21", "heading": "\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E43\u0E19\u0E41\u0E25\u0E30\u0E23\u0E2D\u0E1A\u0E27\u0E31\u0E14", "intro": "\u0E20\u0E32\u0E1E\u0E23\u0E27\u0E21\u0E2A\u0E31\u0E49\u0E19\u0E46 \u0E02\u0E2D\u0E07\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E20\u0E32\u0E22\u0E43\u0E19\u0E44\u0E21\u0E48\u0E01\u0E35\u0E48\u0E19\u0E32\u0E17\u0E35\u0E08\u0E32\u0E01\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E27\u0E31\u0E14 \u2014 \u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E15\u0E32\u0E21\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E23\u0E39\u0E49\u0E27\u0E48\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E2D\u0E07\u0E2B\u0E32\u0E2D\u0E30\u0E44\u0E23 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E23\u0E49\u0E32\u0E19\u0E43\u0E14\u0E23\u0E49\u0E32\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07", "neutralNote": "\u0E43\u0E19\u0E10\u0E32\u0E19\u0E30\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E2D\u0E34\u0E2A\u0E23\u0E30\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E41\u0E2A\u0E27\u0E07\u0E2B\u0E32\u0E01\u0E33\u0E44\u0E23 \u0E40\u0E23\u0E32\u0E44\u0E21\u0E48\u0E41\u0E19\u0E30\u0E19\u0E33\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08\u0E23\u0E32\u0E22\u0E43\u0E14\u0E40\u0E1B\u0E47\u0E19\u0E01\u0E32\u0E23\u0E40\u0E09\u0E1E\u0E32\u0E30 \u0E41\u0E15\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17 \u0E23\u0E30\u0E22\u0E30\u0E17\u0E32\u0E07 \u0E41\u0E25\u0E30\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E23\u0E32\u0E04\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B\u0E41\u0E17\u0E19 \u0E40\u0E27\u0E25\u0E32\u0E40\u0E1B\u0E34\u0E14\u0E17\u0E33\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E23\u0E32\u0E04\u0E32\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E1A\u0E48\u0E2D\u0E22 \u0E42\u0E1B\u0E23\u0E14\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E07\u0E32\u0E19", "items": [{ "icon": "\u{1F6BB}", "title": "\u0E2B\u0E49\u0E2D\u0E07\u0E19\u0E49\u0E33", "type": "\u0E2B\u0E49\u0E2D\u0E07\u0E19\u0E49\u0E33\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E30 \xB7 \u0E20\u0E32\u0E22\u0E43\u0E19\u0E27\u0E31\u0E14", "text": "\u0E21\u0E35\u0E2B\u0E49\u0E2D\u0E07\u0E19\u0E49\u0E33\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E30\u0E43\u0E19\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14 \u0E43\u0E01\u0E25\u0E49\u0E17\u0E32\u0E07\u0E40\u0E02\u0E49\u0E32\u0E41\u0E25\u0E30\u0E25\u0E32\u0E19\u0E08\u0E2D\u0E14\u0E23\u0E16 \u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19\u0E41\u0E15\u0E48\u0E21\u0E35\u0E01\u0E32\u0E23\u0E14\u0E39\u0E41\u0E25 \u0E41\u0E19\u0E30\u0E19\u0E33\u0E1E\u0E01\u0E01\u0E23\u0E30\u0E14\u0E32\u0E29\u0E17\u0E34\u0E0A\u0E0A\u0E39\u0E41\u0E25\u0E30\u0E40\u0E08\u0E25\u0E25\u0E49\u0E32\u0E07\u0E21\u0E37\u0E2D\u0E44\u0E1B\u0E40\u0E2D\u0E07" }, { "icon": "\u{1F17F}\uFE0F", "title": "\u0E17\u0E35\u0E48\u0E08\u0E2D\u0E14\u0E23\u0E16", "type": "\u0E25\u0E32\u0E19\u0E08\u0E2D\u0E14\u0E02\u0E19\u0E32\u0E14\u0E40\u0E25\u0E47\u0E01 \xB7 \u0E1F\u0E23\u0E35 / \u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E15\u0E32\u0E21\u0E28\u0E23\u0E31\u0E17\u0E18\u0E32", "text": "\u0E21\u0E35\u0E25\u0E32\u0E19\u0E08\u0E2D\u0E14\u0E23\u0E16\u0E02\u0E19\u0E32\u0E14\u0E40\u0E25\u0E47\u0E01\u0E43\u0E19\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E16\u0E22\u0E19\u0E15\u0E4C\u0E41\u0E25\u0E30\u0E23\u0E16\u0E08\u0E31\u0E01\u0E23\u0E22\u0E32\u0E19\u0E22\u0E19\u0E15\u0E4C \u0E21\u0E31\u0E01\u0E40\u0E15\u0E47\u0E21\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07\u0E43\u0E19\u0E24\u0E14\u0E39\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27 \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E08\u0E2D\u0E14\u0E23\u0E34\u0E21\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22\u0E41\u0E17\u0E19\u0E44\u0E14\u0E49" }, { "icon": "\u{1F35C}", "title": "\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E41\u0E25\u0E30\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E14\u0E37\u0E48\u0E21", "type": "\u0E23\u0E49\u0E32\u0E19\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E23\u0E31\u0E27 \xB7 \u0E23\u0E49\u0E32\u0E19\u0E01\u0E32\u0E41\u0E1F \xB7 \u0E15\u0E25\u0E32\u0E14", "text": "\u0E20\u0E32\u0E22\u0E43\u0E19 5 \u0E19\u0E32\u0E17\u0E35\u0E17\u0E35\u0E48\u0E40\u0E14\u0E34\u0E19 \u0E21\u0E35\u0E23\u0E49\u0E32\u0E19\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E04\u0E23\u0E2D\u0E1A\u0E04\u0E23\u0E31\u0E27\u0E02\u0E19\u0E32\u0E14\u0E40\u0E25\u0E47\u0E01 \u0E23\u0E49\u0E32\u0E19\u0E01\u0E32\u0E41\u0E1F \u0E41\u0E25\u0E30\u0E15\u0E25\u0E32\u0E14\u0E40\u0E0A\u0E49\u0E32\u0E17\u0E35\u0E48\u0E02\u0E32\u0E22\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E40\u0E2B\u0E19\u0E37\u0E2D \u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E21\u0E31\u0E07\u0E2A\u0E27\u0E34\u0E23\u0E31\u0E15\u0E34\u0E1E\u0E1A\u0E44\u0E14\u0E49\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32" }, { "icon": "\u{1F6CF}\uFE0F", "title": "\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01", "type": "\u0E40\u0E01\u0E2A\u0E15\u0E4C\u0E40\u0E2E\u0E32\u0E2A\u0E4C \u2192 \u0E42\u0E23\u0E07\u0E41\u0E23\u0E21\u0E1A\u0E39\u0E15\u0E34\u0E01", "text": "\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E21\u0E35\u0E17\u0E35\u0E48\u0E1E\u0E31\u0E01\u0E04\u0E23\u0E1A\u0E17\u0E38\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E23\u0E32\u0E04\u0E32 \u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48\u0E40\u0E01\u0E2A\u0E15\u0E4C\u0E40\u0E2E\u0E32\u0E2A\u0E4C\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E23\u0E30\u0E2B\u0E22\u0E31\u0E14\u0E16\u0E36\u0E07\u0E42\u0E23\u0E07\u0E41\u0E23\u0E21\u0E1A\u0E39\u0E15\u0E34\u0E01\u0E02\u0E19\u0E32\u0E14\u0E40\u0E25\u0E47\u0E01 \u0E2A\u0E48\u0E27\u0E19\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E32\u0E04\u0E32\u0E23\u0E40\u0E15\u0E35\u0E49\u0E22\u0E17\u0E35\u0E48\u0E14\u0E31\u0E14\u0E41\u0E1B\u0E25\u0E07\u0E08\u0E32\u0E01\u0E15\u0E36\u0E01\u0E41\u0E16\u0E27 \u0E1E\u0E31\u0E01\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E08\u0E30\u0E40\u0E14\u0E34\u0E19\u0E16\u0E36\u0E07\u0E27\u0E31\u0E14\u0E44\u0E14\u0E49" }, { "icon": "\u{1F3EA}", "title": "\u0E23\u0E49\u0E32\u0E19\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E0B\u0E37\u0E49\u0E2D\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49", "type": "\u0E23\u0E49\u0E32\u0E19\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E0B\u0E37\u0E49\u0E2D \xB7 \u0E21\u0E34\u0E19\u0E34\u0E21\u0E32\u0E23\u0E4C\u0E17 \xB7 \u0E23\u0E49\u0E32\u0E19\u0E02\u0E32\u0E22\u0E22\u0E32", "text": "\u0E23\u0E49\u0E32\u0E19\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E0B\u0E37\u0E49\u0E2D\u0E41\u0E25\u0E30\u0E21\u0E34\u0E19\u0E34\u0E21\u0E32\u0E23\u0E4C\u0E17\u0E40\u0E23\u0E35\u0E22\u0E07\u0E23\u0E32\u0E22\u0E1A\u0E19\u0E16\u0E19\u0E19\u0E2A\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E01\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E2A\u0E48\u0E27\u0E19\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E19\u0E32\u0E19 \u0E43\u0E01\u0E25\u0E49\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E22\u0E31\u0E07\u0E21\u0E35\u0E15\u0E25\u0E32\u0E14\u0E14\u0E31\u0E49\u0E07\u0E40\u0E14\u0E34\u0E21\u0E02\u0E32\u0E22\u0E1C\u0E25\u0E44\u0E21\u0E49 \u0E19\u0E49\u0E33\u0E14\u0E37\u0E48\u0E21 \u0E41\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19" }, { "icon": "\u26FD", "title": "\u0E19\u0E49\u0E33\u0E21\u0E31\u0E19\u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E0A\u0E32\u0E23\u0E4C\u0E08", "type": "\u0E1B\u0E31\u0E4A\u0E21\u0E19\u0E49\u0E33\u0E21\u0E31\u0E19 \xB7 \u0E08\u0E38\u0E14\u0E0A\u0E32\u0E23\u0E4C\u0E08\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E30", "text": "\u0E1B\u0E31\u0E4A\u0E21\u0E19\u0E49\u0E33\u0E21\u0E31\u0E19\u0E1A\u0E19\u0E16\u0E19\u0E19\u0E27\u0E07\u0E41\u0E2B\u0E27\u0E19\u0E23\u0E2D\u0E1A\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E02\u0E31\u0E1A\u0E23\u0E16\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 5 \u0E19\u0E32\u0E17\u0E35 \u0E41\u0E25\u0E30\u0E21\u0E35\u0E08\u0E38\u0E14\u0E0A\u0E32\u0E23\u0E4C\u0E08 AC/DC \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E23\u0E16\u0E22\u0E19\u0E15\u0E4C\u0E44\u0E1F\u0E1F\u0E49\u0E32\u0E17\u0E35\u0E48\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E01\u0E32\u0E23\u0E04\u0E49\u0E32\u0E41\u0E25\u0E30\u0E42\u0E23\u0E07\u0E41\u0E23\u0E21\u0E02\u0E19\u0E32\u0E14\u0E43\u0E2B\u0E0D\u0E48\u0E1A\u0E19\u0E16\u0E19\u0E19\u0E27\u0E07\u0E41\u0E2B\u0E27\u0E19" }, { "icon": "\u{1F3E5}", "title": "\u0E01\u0E32\u0E23\u0E41\u0E1E\u0E17\u0E22\u0E4C\u0E41\u0E25\u0E30\u0E23\u0E49\u0E32\u0E19\u0E02\u0E32\u0E22\u0E22\u0E32", "type": "\u0E23\u0E49\u0E32\u0E19\u0E02\u0E32\u0E22\u0E22\u0E32 \xB7 \u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25 10\u201315 \u0E19\u0E32\u0E17\u0E35", "text": "\u0E23\u0E49\u0E32\u0E19\u0E02\u0E32\u0E22\u0E22\u0E32\u0E21\u0E35\u0E21\u0E32\u0E01\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E2D\u0E32\u0E01\u0E32\u0E23\u0E40\u0E25\u0E47\u0E01\u0E19\u0E49\u0E2D\u0E22\u0E44\u0E14\u0E49 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E01\u0E23\u0E13\u0E35\u0E23\u0E38\u0E19\u0E41\u0E23\u0E07 \u0E42\u0E23\u0E07\u0E1E\u0E22\u0E32\u0E1A\u0E32\u0E25\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B\u0E41\u0E25\u0E30\u0E40\u0E2D\u0E01\u0E0A\u0E19\u0E2D\u0E22\u0E39\u0E48\u0E2B\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 10\u201315 \u0E19\u0E32\u0E17\u0E35\u0E42\u0E14\u0E22\u0E23\u0E16\u0E22\u0E19\u0E15\u0E4C \u0E04\u0E27\u0E23\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07" }, { "icon": "\u{1F3E7}", "title": "\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14\u0E41\u0E25\u0E30\u0E18\u0E19\u0E32\u0E04\u0E32\u0E23", "type": "\u0E15\u0E39\u0E49 ATM \xB7 \u0E08\u0E38\u0E14\u0E41\u0E25\u0E01\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E07\u0E34\u0E19", "text": "\u0E21\u0E35\u0E15\u0E39\u0E49 ATM \u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E41\u0E25\u0E01\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E40\u0E07\u0E34\u0E19\u0E17\u0E35\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E1A\u0E19\u0E16\u0E19\u0E19\u0E2A\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E01\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E27\u0E31\u0E14\u0E40\u0E25\u0E47\u0E01\u0E46 \u0E41\u0E25\u0E30\u0E41\u0E1C\u0E07\u0E15\u0E25\u0E32\u0E14\u0E23\u0E31\u0E1A\u0E40\u0E09\u0E1E\u0E32\u0E30\u0E40\u0E07\u0E34\u0E19\u0E2A\u0E14 \u0E04\u0E27\u0E23\u0E1E\u0E01\u0E18\u0E19\u0E1A\u0E31\u0E15\u0E23\u0E44\u0E27\u0E49\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E41\u0E25\u0E30\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E2D\u0E07\u0E01\u0E34\u0E19" }], "walkingNote": "\u0E23\u0E30\u0E22\u0E30\u0E08\u0E32\u0E01\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E27\u0E31\u0E14 \u0E23\u0E49\u0E32\u0E19\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E0B\u0E37\u0E49\u0E2D 2\u20134 \u0E19\u0E32\u0E17\u0E35 \xB7 \u0E23\u0E49\u0E32\u0E19\u0E2D\u0E32\u0E2B\u0E32\u0E23 3\u20135 \u0E19\u0E32\u0E17\u0E35 \xB7 \u0E23\u0E49\u0E32\u0E19\u0E02\u0E32\u0E22\u0E22\u0E32 5\u20138 \u0E19\u0E32\u0E17\u0E35 \xB7 \u0E1B\u0E31\u0E4A\u0E21\u0E19\u0E49\u0E33\u0E21\u0E31\u0E19 5 \u0E19\u0E32\u0E17\u0E35\u0E42\u0E14\u0E22\u0E23\u0E16\u0E22\u0E19\u0E15\u0E4C" };
    responsibility$2 = { "label": "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E39\u0E49\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14\u0E0A\u0E2D\u0E1A", "heading": "\u0E27\u0E34\u0E18\u0E35\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E04\u0E32\u0E23\u0E1E", "intro": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E31\u0E49\u0E07\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E2A\u0E16\u0E32\u0E19\u0E41\u0E25\u0E30\u0E27\u0E31\u0E14\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1E\u0E23\u0E30\u0E2A\u0E07\u0E06\u0E4C\u0E08\u0E33\u0E1E\u0E23\u0E23\u0E29\u0E32 \u0E21\u0E35\u0E1E\u0E23\u0E30\u0E41\u0E25\u0E30\u0E2A\u0E32\u0E21\u0E40\u0E13\u0E23\u0E2D\u0E32\u0E28\u0E31\u0E22\u0E41\u0E25\u0E30\u0E28\u0E36\u0E01\u0E29\u0E32\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E32\u0E27\u0E2B\u0E01\u0E2A\u0E34\u0E1A\u0E23\u0E39\u0E1B \u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E43\u0E08\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E01\u0E33\u0E25\u0E31\u0E07\u0E14\u0E39\u0E08\u0E30\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E01\u0E32\u0E23\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E14\u0E35\u0E02\u0E36\u0E49\u0E19 \u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E23\u0E30\u0E21\u0E31\u0E14\u0E23\u0E30\u0E27\u0E31\u0E07\u0E40\u0E25\u0E47\u0E01\u0E19\u0E49\u0E2D\u0E22\u0E08\u0E30\u0E0A\u0E48\u0E27\u0E22\u0E23\u0E31\u0E01\u0E29\u0E32\u0E44\u0E27\u0E49\u0E44\u0E14\u0E49", "groups": [{ "title": "\u0E01\u0E32\u0E23\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32", "points": ["\u0E1B\u0E01\u0E1B\u0E34\u0E14\u0E44\u0E2B\u0E25\u0E48\u0E41\u0E25\u0E30\u0E40\u0E02\u0E48\u0E32 \u0E1C\u0E49\u0E32\u0E1E\u0E31\u0E19\u0E04\u0E2D\u0E1A\u0E32\u0E07\u0E46 \u0E0A\u0E48\u0E27\u0E22\u0E41\u0E01\u0E49\u0E1B\u0E31\u0E0D\u0E2B\u0E32\u0E44\u0E14\u0E49\u0E40\u0E01\u0E37\u0E2D\u0E1A\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", "\u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E02\u0E49\u0E32\u0E2D\u0E32\u0E04\u0E32\u0E23 \u0E41\u0E25\u0E30\u0E2D\u0E22\u0E48\u0E32\u0E40\u0E2D\u0E32\u0E40\u0E17\u0E49\u0E32\u0E0A\u0E35\u0E49\u0E44\u0E1B\u0E17\u0E32\u0E07\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B", "\u0E16\u0E2D\u0E14\u0E2B\u0E21\u0E27\u0E01\u0E43\u0E19\u0E2D\u0E32\u0E04\u0E32\u0E23 \u0E41\u0E25\u0E30\u0E01\u0E49\u0E32\u0E27\u0E02\u0E49\u0E32\u0E21 \u2014 \u0E44\u0E21\u0E48\u0E40\u0E2B\u0E22\u0E35\u0E22\u0E1A \u2014 \u0E18\u0E23\u0E13\u0E35\u0E1B\u0E23\u0E30\u0E15\u0E39"] }, { "title": "\u0E04\u0E27\u0E32\u0E21\u0E1B\u0E23\u0E30\u0E1E\u0E24\u0E15\u0E34\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E07\u0E35\u0E22\u0E1A", "points": ["\u0E1E\u0E39\u0E14\u0E40\u0E1A\u0E32 \u0E21\u0E35\u0E01\u0E32\u0E23\u0E2A\u0E27\u0E14\u0E21\u0E19\u0E15\u0E4C\u0E41\u0E25\u0E30\u0E40\u0E23\u0E35\u0E22\u0E19\u0E2B\u0E19\u0E31\u0E07\u0E2A\u0E37\u0E2D\u0E40\u0E01\u0E37\u0E2D\u0E1A\u0E17\u0E38\u0E01\u0E40\u0E0A\u0E49\u0E32\u0E41\u0E25\u0E30\u0E40\u0E22\u0E47\u0E19", "\u0E2D\u0E22\u0E48\u0E32\u0E2A\u0E31\u0E21\u0E1C\u0E31\u0E2A\u0E08\u0E34\u0E15\u0E23\u0E01\u0E23\u0E23\u0E21\u0E1D\u0E32\u0E1C\u0E19\u0E31\u0E07 \u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B \u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E32\u0E22\u0E41\u0E01\u0E30\u0E2A\u0E25\u0E31\u0E01\u0E44\u0E21\u0E49 \u2014 \u0E19\u0E49\u0E33\u0E21\u0E31\u0E19\u0E08\u0E32\u0E01\u0E1C\u0E34\u0E27\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E2A\u0E35\u0E22\u0E2B\u0E32\u0E22\u0E16\u0E32\u0E27\u0E23", "\u0E02\u0E2D\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E01\u0E48\u0E2D\u0E19\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E1E\u0E23\u0E30 \u0E41\u0E25\u0E30\u0E2D\u0E22\u0E48\u0E32\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E1C\u0E39\u0E49\u0E17\u0E35\u0E48\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2A\u0E27\u0E14\u0E21\u0E19\u0E15\u0E4C"] }, { "title": "\u0E01\u0E32\u0E23\u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E41\u0E25\u0E30\u0E2A\u0E34\u0E48\u0E07\u0E41\u0E27\u0E14\u0E25\u0E49\u0E2D\u0E21", "points": ["\u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E1F\u0E23\u0E35 \u0E01\u0E32\u0E23\u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E40\u0E1B\u0E47\u0E19\u0E44\u0E1B\u0E15\u0E32\u0E21\u0E28\u0E23\u0E31\u0E17\u0E18\u0E32 \u0E41\u0E25\u0E30\u0E43\u0E0A\u0E49\u0E43\u0E19\u0E01\u0E32\u0E23\u0E14\u0E39\u0E41\u0E25\u0E27\u0E31\u0E14", "\u0E44\u0E21\u0E48\u0E17\u0E34\u0E49\u0E07\u0E02\u0E22\u0E30 \u0E41\u0E25\u0E30\u0E1E\u0E01\u0E02\u0E27\u0E14\u0E19\u0E49\u0E33\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 \u2014 \u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E21\u0E35\u0E08\u0E38\u0E14\u0E40\u0E15\u0E34\u0E21\u0E19\u0E49\u0E33\u0E2B\u0E25\u0E32\u0E22\u0E41\u0E2B\u0E48\u0E07", "\u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E42\u0E14\u0E23\u0E19\u0E41\u0E25\u0E30\u0E02\u0E32\u0E15\u0E31\u0E49\u0E07\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E43\u0E19\u0E27\u0E31\u0E14\u0E2B\u0E32\u0E01\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E40\u0E1B\u0E47\u0E19\u0E25\u0E32\u0E22\u0E25\u0E31\u0E01\u0E29\u0E13\u0E4C\u0E2D\u0E31\u0E01\u0E29\u0E23"] }], "pledge": "\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E01\u0E25\u0E31\u0E1A\u0E44\u0E1B \u0E44\u0E21\u0E48\u0E17\u0E34\u0E49\u0E07\u0E2D\u0E30\u0E44\u0E23\u0E44\u0E27\u0E49 \u0E41\u0E25\u0E30\u0E1B\u0E25\u0E48\u0E2D\u0E22\u0E43\u0E2B\u0E49\u0E1C\u0E39\u0E49\u0E17\u0E35\u0E48\u0E21\u0E32\u0E2A\u0E31\u0E01\u0E01\u0E32\u0E23\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E1C\u0E39\u0E49\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E08\u0E31\u0E07\u0E2B\u0E27\u0E30 \u0E19\u0E35\u0E48\u0E04\u0E37\u0E2D\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E02\u0E2D\u0E07\u0E21\u0E32\u0E23\u0E22\u0E32\u0E17\u0E43\u0E19\u0E27\u0E31\u0E14", "scienceNote": "\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E17\u0E35\u0E48\u0E2A\u0E33\u0E04\u0E31\u0E0D \u0E08\u0E34\u0E15\u0E23\u0E01\u0E23\u0E23\u0E21\u0E1B\u0E39\u0E19\u0E02\u0E32\u0E27 \u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01 \u0E41\u0E25\u0E30\u0E20\u0E32\u0E1E\u0E2A\u0E25\u0E31\u0E01\u0E2B\u0E34\u0E19\u0E17\u0E23\u0E32\u0E22\u0E43\u0E19\u0E20\u0E32\u0E04\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E2D\u0E14\u0E43\u0E19\u0E20\u0E39\u0E21\u0E34\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E49\u0E2D\u0E19\u0E0A\u0E37\u0E49\u0E19\u0E44\u0E14\u0E49\u0E40\u0E1E\u0E23\u0E32\u0E30\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E14\u0E39\u0E41\u0E25\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19 \u0E04\u0E27\u0E32\u0E21\u0E0A\u0E37\u0E49\u0E19 \u0E41\u0E1F\u0E25\u0E0A \u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E2A\u0E31\u0E21\u0E1C\u0E31\u0E2A \u0E04\u0E37\u0E2D\u0E2A\u0E32\u0E21\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E17\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E2A\u0E37\u0E48\u0E2D\u0E21\u0E2A\u0E20\u0E32\u0E1E\u0E40\u0E23\u0E47\u0E27\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14" };
    legends$2 = { "label": "\u0E19\u0E34\u0E17\u0E32\u0E19\u0E41\u0E25\u0E30\u0E15\u0E33\u0E19\u0E32\u0E19", "heading": "\u0E15\u0E33\u0E19\u0E32\u0E19\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E2B\u0E25\u0E31\u0E07\u0E27\u0E31\u0E14", "intro": "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E43\u0E19\u0E04\u0E31\u0E21\u0E20\u0E35\u0E23\u0E4C\u0E43\u0E1A\u0E25\u0E32\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E35\u0E22\u0E01\u0E27\u0E48\u0E32 \u0E15\u0E33\u0E19\u0E32\u0E19 \u0E0B\u0E36\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07 \u0E04\u0E27\u0E32\u0E21\u0E40\u0E0A\u0E37\u0E48\u0E2D \u0E41\u0E25\u0E30\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E40\u0E25\u0E48\u0E32\u0E02\u0E2D\u0E07\u0E23\u0E32\u0E0A\u0E2A\u0E33\u0E19\u0E31\u0E01\u0E2D\u0E22\u0E39\u0E48\u0E14\u0E49\u0E27\u0E22\u0E01\u0E31\u0E19 \u0E15\u0E48\u0E2D\u0E44\u0E1B\u0E19\u0E35\u0E49\u0E04\u0E37\u0E2D\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E23\u0E32\u0E27\u0E17\u0E35\u0E48\u0E1C\u0E39\u0E01\u0E01\u0E31\u0E1A\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "stories": [{ "tag": "\u0E01\u0E32\u0E23\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07", "title": "\u0E17\u0E35\u0E48\u0E2B\u0E22\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E0A\u0E49\u0E32\u0E07\u0E40\u0E1C\u0E37\u0E2D\u0E01", "text": "\u0E01\u0E25\u0E48\u0E32\u0E27\u0E01\u0E31\u0E19\u0E27\u0E48\u0E32\u0E1E\u0E0D\u0E32\u0E21\u0E31\u0E07\u0E23\u0E32\u0E22\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E19\u0E35\u0E49\u0E02\u0E13\u0E30\u0E40\u0E2A\u0E32\u0E30\u0E2B\u0E32\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E2B\u0E25\u0E27\u0E07\u0E41\u0E2B\u0E48\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E0A\u0E49\u0E32\u0E07\u0E40\u0E1C\u0E37\u0E2D\u0E01 \u2014 \u0E2A\u0E31\u0E0D\u0E25\u0E31\u0E01\u0E29\u0E13\u0E4C\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14\u0E02\u0E2D\u0E07\u0E2D\u0E33\u0E19\u0E32\u0E08\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C\u0E43\u0E19\u0E20\u0E39\u0E21\u0E34\u0E20\u0E32\u0E04 \u2014 \u0E2B\u0E22\u0E38\u0E14 \u0E13 \u0E17\u0E35\u0E48\u0E19\u0E35\u0E49 \u0E23\u0E49\u0E2D\u0E07\u0E2A\u0E32\u0E21\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E22\u0E2D\u0E21\u0E40\u0E14\u0E34\u0E19\u0E15\u0E48\u0E2D \u0E1E\u0E0D\u0E32\u0E21\u0E31\u0E07\u0E23\u0E32\u0E22\u0E08\u0E36\u0E07\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E22 \u0E40\u0E23\u0E35\u0E22\u0E01\u0E27\u0E48\u0E32 \u0E40\u0E27\u0E35\u0E22\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E19\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07\u0E40\u0E15\u0E34\u0E1A\u0E42\u0E15\u0E2D\u0E2D\u0E01\u0E44\u0E1B\u0E08\u0E32\u0E01\u0E04\u0E48\u0E32\u0E22\u0E19\u0E35\u0E49" }, { "tag": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C", "title": "\u0E1E\u0E23\u0E30\u0E41\u0E2A\u0E07\u0E41\u0E14\u0E07\u0E04\u0E33\u0E2B\u0E21\u0E32\u0E01\u0E19\u0E49\u0E2D\u0E22 \u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E1C\u0E25\u0E36\u0E01", "text": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E2D\u0E07\u0E04\u0E4C\u0E40\u0E25\u0E47\u0E01\u0E41\u0E01\u0E30\u0E2A\u0E25\u0E31\u0E01\u0E08\u0E32\u0E01\u0E1C\u0E25\u0E36\u0E01\u0E43\u0E2A \u0E27\u0E48\u0E32\u0E01\u0E31\u0E19\u0E27\u0E48\u0E32\u0E19\u0E33\u0E21\u0E32\u0E08\u0E32\u0E01\u0E2D\u0E32\u0E13\u0E32\u0E08\u0E31\u0E01\u0E23\u0E21\u0E2D\u0E0D\u0E25\u0E30\u0E42\u0E27\u0E49 (\u0E25\u0E1E\u0E1A\u0E38\u0E23\u0E35\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19) \u0E41\u0E25\u0E30\u0E1E\u0E0D\u0E32\u0E21\u0E31\u0E07\u0E23\u0E32\u0E22\u0E19\u0E33\u0E02\u0E36\u0E49\u0E19\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E21\u0E32\u0E40\u0E2D\u0E07 \u0E04\u0E27\u0E32\u0E21\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E16\u0E37\u0E2D\u0E27\u0E48\u0E32\u0E1B\u0E01\u0E1B\u0E49\u0E2D\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E08\u0E32\u0E01\u0E1E\u0E32\u0E22\u0E38\u0E41\u0E25\u0E30\u0E2D\u0E31\u0E04\u0E04\u0E35\u0E20\u0E31\u0E22 \u0E1B\u0E01\u0E15\u0E34\u0E1B\u0E23\u0E30\u0E14\u0E34\u0E29\u0E10\u0E32\u0E19\u0E43\u0E19\u0E2B\u0E2D\u0E44\u0E15\u0E23\u0E41\u0E25\u0E30\u0E19\u0E33\u0E2D\u0E2D\u0E01\u0E41\u0E2A\u0E14\u0E07\u0E43\u0E19\u0E40\u0E17\u0E28\u0E01\u0E32\u0E25\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19" }, { "tag": "\u0E1E\u0E34\u0E18\u0E35\u0E02\u0E2D\u0E1D\u0E19", "title": "\u0E1E\u0E23\u0E30\u0E28\u0E34\u0E25\u0E32\u0E41\u0E25\u0E30\u0E04\u0E33\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E41\u0E2B\u0E48\u0E07\u0E1D\u0E19", "text": "\u0E1E\u0E23\u0E30\u0E28\u0E34\u0E25\u0E32 \u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E2A\u0E25\u0E31\u0E01\u0E2B\u0E34\u0E19\u0E17\u0E23\u0E32\u0E22 \u0E40\u0E1B\u0E47\u0E19\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E27\u0E31\u0E15\u0E16\u0E38\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E2D\u0E35\u0E01\u0E0A\u0E34\u0E49\u0E19\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14 \u0E40\u0E19\u0E37\u0E48\u0E2D\u0E07\u0E08\u0E32\u0E01\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E02\u0E49\u0E2D\u0E07\u0E01\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E1D\u0E19 \u0E08\u0E36\u0E07\u0E41\u0E2B\u0E48\u0E44\u0E1B\u0E15\u0E32\u0E21\u0E16\u0E19\u0E19\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E0A\u0E48\u0E27\u0E07\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19\u0E2A\u0E23\u0E07\u0E19\u0E49\u0E33\u0E2D\u0E1A\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E43\u0E2B\u0E49\u0E24\u0E14\u0E39\u0E40\u0E1E\u0E32\u0E30\u0E1B\u0E25\u0E39\u0E01\u0E14\u0E35" }, { "tag": "\u0E1E\u0E31\u0E19\u0E18\u0E21\u0E34\u0E15\u0E23", "title": "\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E02\u0E2D\u0E07\u0E2A\u0E32\u0E21\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C", "text": "\u0E01\u0E48\u0E2D\u0E19\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E1E\u0E0D\u0E32\u0E21\u0E31\u0E07\u0E23\u0E32\u0E22\u0E41\u0E2B\u0E48\u0E07\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32 \u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E23\u0E32\u0E21\u0E04\u0E33\u0E41\u0E2B\u0E07\u0E41\u0E2B\u0E48\u0E07\u0E2A\u0E38\u0E42\u0E02\u0E17\u0E31\u0E22 \u0E41\u0E25\u0E30\u0E1E\u0E0D\u0E32\u0E07\u0E33\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E41\u0E2B\u0E48\u0E07\u0E1E\u0E30\u0E40\u0E22\u0E32 \u0E01\u0E25\u0E48\u0E32\u0E27\u0E01\u0E31\u0E19\u0E27\u0E48\u0E32\u0E44\u0E14\u0E49\u0E17\u0E33\u0E2A\u0E31\u0E0D\u0E0D\u0E32\u0E1E\u0E31\u0E19\u0E18\u0E21\u0E34\u0E15\u0E23\u0E0B\u0E36\u0E48\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E2A\u0E16\u0E35\u0E22\u0E23\u0E20\u0E32\u0E1E\u0E43\u0E2B\u0E49\u0E2B\u0E38\u0E1A\u0E40\u0E02\u0E32\u0E20\u0E32\u0E04\u0E40\u0E2B\u0E19\u0E37\u0E2D \u0E2D\u0E19\u0E38\u0E2A\u0E32\u0E27\u0E23\u0E35\u0E22\u0E4C\u0E2A\u0E32\u0E21\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C\u0E43\u0E01\u0E25\u0E49\u0E27\u0E31\u0E14\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E23\u0E30\u0E25\u0E36\u0E01\u0E16\u0E36\u0E07\u0E40\u0E2B\u0E15\u0E38\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E19\u0E35\u0E49 \u0E41\u0E25\u0E30\u0E2D\u0E18\u0E34\u0E1A\u0E32\u0E22\u0E27\u0E48\u0E32\u0E17\u0E33\u0E44\u0E21\u0E21\u0E38\u0E21\u0E19\u0E35\u0E49\u0E02\u0E2D\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E08\u0E36\u0E07\u0E16\u0E37\u0E2D\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E38\u0E14\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14\u0E40\u0E21\u0E37\u0E2D\u0E07" }, { "tag": "\u0E2A\u0E31\u0E0D\u0E25\u0E31\u0E01\u0E29\u0E13\u0E4C", "title": "\u0E19\u0E32\u0E04 \u0E0A\u0E49\u0E32\u0E07 \u0E41\u0E25\u0E30\u0E1C\u0E39\u0E49\u0E1E\u0E34\u0E17\u0E31\u0E01\u0E29\u0E4C", "text": "\u0E1A\u0E31\u0E19\u0E44\u0E14\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E02\u0E19\u0E32\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E25\u0E39\u0E01\u0E01\u0E23\u0E07\u0E23\u0E39\u0E1B\u0E19\u0E32\u0E04 \u0E40\u0E17\u0E1E\u0E40\u0E08\u0E49\u0E32\u0E41\u0E2B\u0E48\u0E07\u0E19\u0E49\u0E33\u0E43\u0E19\u0E08\u0E31\u0E01\u0E23\u0E27\u0E32\u0E25\u0E27\u0E34\u0E17\u0E22\u0E32\u0E1E\u0E38\u0E17\u0E18 \u0E02\u0E13\u0E30\u0E17\u0E35\u0E48\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E43\u0E2B\u0E0D\u0E48\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E1A\u0E19\u0E41\u0E16\u0E27\u0E0A\u0E49\u0E32\u0E07\u0E41\u0E01\u0E30\u0E2A\u0E25\u0E31\u0E01 \u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E40\u0E08\u0E15\u0E19\u0E32\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E14\u0E49\u0E27\u0E22\u0E2B\u0E34\u0E19 \u0E04\u0E37\u0E2D\u0E04\u0E33\u0E2A\u0E2D\u0E19\u0E02\u0E2D\u0E07\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E40\u0E08\u0E49\u0E32\u0E17\u0E35\u0E48\u0E04\u0E49\u0E33\u0E08\u0E38\u0E19\u0E14\u0E49\u0E27\u0E22\u0E1E\u0E25\u0E31\u0E07\u0E02\u0E2D\u0E07\u0E41\u0E1C\u0E48\u0E19\u0E14\u0E34\u0E19" }], "note": "\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E40\u0E25\u0E48\u0E32\u0E40\u0E2B\u0E25\u0E48\u0E32\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E1E\u0E13\u0E35\u0E02\u0E2D\u0E07\u0E15\u0E33\u0E19\u0E32\u0E19 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E44\u0E27\u0E49 \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E15\u0E33\u0E19\u0E32\u0E19\u0E02\u0E31\u0E14\u0E41\u0E22\u0E49\u0E07\u0E01\u0E31\u0E1A\u0E42\u0E1A\u0E23\u0E32\u0E13\u0E04\u0E14\u0E35 \u0E08\u0E32\u0E23\u0E36\u0E01\u0E41\u0E25\u0E30\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19\u0E01\u0E32\u0E23\u0E02\u0E38\u0E14\u0E04\u0E49\u0E19\u0E04\u0E37\u0E2D\u0E2B\u0E25\u0E31\u0E01\u0E10\u0E32\u0E19\u0E17\u0E35\u0E48\u0E14\u0E35\u0E01\u0E27\u0E48\u0E32 \u0E41\u0E15\u0E48\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E40\u0E25\u0E48\u0E32\u0E40\u0E2B\u0E25\u0E48\u0E32\u0E19\u0E35\u0E49\u0E04\u0E37\u0E2D\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E19\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19\u0E40\u0E25\u0E48\u0E32\u0E01\u0E31\u0E19\u0E21\u0E32\u0E40\u0E08\u0E47\u0E14\u0E28\u0E15\u0E27\u0E23\u0E23\u0E29" };
    hero$2 = { "titleMain": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "titleAccent": "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "eyebrow": "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E22\u0E38\u0E04\u0E40\u0E01\u0E48\u0E32 \xB7 \u0E01\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07 1296", "subtitle": "\u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E17\u0E35\u0E48\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E04\u0E23\u0E32\u0E27\u0E2A\u0E16\u0E32\u0E1B\u0E19\u0E32\u0E40\u0E21\u0E37\u0E2D\u0E07 \u2014 \u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E41\u0E1A\u0E1A\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32 \u0E17\u0E48\u0E32\u0E21\u0E01\u0E25\u0E32\u0E07\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E2A\u0E35\u0E02\u0E32\u0E27 \u0E40\u0E2A\u0E32\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01 \u0E41\u0E25\u0E30\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "cta1": "\u0E27\u0E32\u0E07\u0E41\u0E1C\u0E19\u0E01\u0E32\u0E23\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27", "cta2": "\u0E14\u0E39\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48", "rating": "4.7", "reviewCount": "6,192 \u0E23\u0E35\u0E27\u0E34\u0E27\u0E43\u0E19 Google", "coordsLabel": "\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "viewLocation": "\u0E14\u0E39\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E1A\u0E19 Google Maps", "titleCity": "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "heroAlt": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 - \u0E27\u0E34\u0E27\u0E2B\u0E25\u0E31\u0E01\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22", "boardCategory": "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19", "boardTitle": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "boardEn": "Wat Chiang Man \xB7 Chiang Mai, Thailand", "plannerTitle": "\u0E41\u0E1C\u0E19\u0E01\u0E32\u0E23\u0E16\u0E48\u0E32\u0E22\u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07", "liveWeather": "\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E2A\u0E14", "plannerNote": "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E15\u0E32\u0E21\u0E24\u0E14\u0E39\u0E01\u0E32\u0E25 \u2014 \u0E40\u0E1B\u0E47\u0E19\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E41\u0E19\u0E27\u0E17\u0E32\u0E07", "defaultTemp": "28\xB0C", "defaultCond": "\u0E42\u0E1B\u0E23\u0E48\u0E07\u0E43\u0E2A", "defaultWind": "5 \u0E01\u0E21./\u0E0A\u0E21.", "sunsetIndexLabel": "\u0E14\u0E31\u0E0A\u0E19\u0E35\u0E41\u0E2A\u0E07", "sunsetIndexDefault": "\u0E22\u0E2D\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21", "goldenHourLabel": "\u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07", "sunsetLabel": "\u0E1E\u0E23\u0E30\u0E2D\u0E32\u0E17\u0E34\u0E15\u0E22\u0E4C\u0E15\u0E01", "blueHourLabel": "\u0E41\u0E2A\u0E07\u0E04\u0E23\u0E32\u0E21", "defaultGolden": "18:10", "defaultSunset": "18:50", "defaultBlue": "19:10", "crowdWarningLabel": "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E39\u0E49\u0E04\u0E19", "defaultTip": "\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E01\u0E48\u0E2D\u0E19 08:00 \u0E41\u0E25\u0E30\u0E2B\u0E25\u0E31\u0E07 17:00 \u0E22\u0E32\u0E21\u0E40\u0E0A\u0E49\u0E32\u0E41\u0E2A\u0E07\u0E2A\u0E27\u0E22\u0E2A\u0E38\u0E14", "lightCaption": "\u0E04\u0E32\u0E14\u0E01\u0E32\u0E23\u0E13\u0E4C\u0E41\u0E2A\u0E07\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E1E\u0E23\u0E30\u0E2D\u0E32\u0E17\u0E34\u0E15\u0E22\u0E4C\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19 (Asia/Bangkok)", "weatherError": "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E42\u0E2B\u0E25\u0E14\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E44\u0E14\u0E49", "goldenChanceLabel": "\u0E42\u0E2D\u0E01\u0E32\u0E2A\u0E41\u0E2A\u0E07\u0E17\u0E2D\u0E07", "quickFacts": { "duration": "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E19\u0E30\u0E19\u0E33", "durationVal": "\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 45 \u0E19\u0E32\u0E17\u0E35", "fee": "\u0E04\u0E48\u0E32\u0E40\u0E02\u0E49\u0E32", "feeVal": "\u0E1F\u0E23\u0E35 (\u0E23\u0E31\u0E1A\u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04)", "dress": "\u0E01\u0E32\u0E23\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22", "dressVal": "\u0E1B\u0E01\u0E1B\u0E34\u0E14\u0E44\u0E2B\u0E25\u0E48\u2013\u0E2B\u0E31\u0E27\u0E40\u0E02\u0E48\u0E32 \xB7 \u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32", "mustSee": "3 \u0E2A\u0E34\u0E48\u0E07\u0E2B\u0E49\u0E32\u0E21\u0E1E\u0E25\u0E32\u0E14", "mustSeeVal": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07 \xB7 \u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27 \xB7 \u0E1E\u0E23\u0E30\u0E2B\u0E34\u0E19" } };
    about$2 = { "label": "\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A", "heading": "\u0E27\u0E31\u0E14\u0E41\u0E23\u0E01\u0E02\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "headingEntity": "\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u2014 \u0E27\u0E31\u0E14\u0E41\u0E23\u0E01\u0E02\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "entityLead": "\u0E22\u0E34\u0E19\u0E14\u0E35\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E2A\u0E39\u0E48**\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 (Wat Chiang Man / \u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19)** \u2014 \u0E27\u0E31\u0E14\u0E17\u0E35\u0E48 **watchiangman.com** \u0E2D\u0E38\u0E17\u0E34\u0E28\u0E43\u0E2B\u0E49 \u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E08\u0E01\u0E25\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32**\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48** \u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14**\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48** \u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28**\u0E44\u0E17\u0E22** \u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E14\u0E17\u0E35\u0E48\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E41\u0E25\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E38\u0E14\u0E2B\u0E21\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E21\u0E32\u0E40\u0E22\u0E37\u0E2D\u0E19", "lead": "\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E2A\u0E07\u0E1A\u0E17\u0E32\u0E07\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E02\u0E2D\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E04\u0E37\u0E2D\u0E08\u0E38\u0E14\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "paragraph1": "\u0E1B\u0E35 1296 \u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E17\u0E23\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E02\u0E13\u0E30\u0E2A\u0E16\u0E32\u0E1B\u0E19\u0E32\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E2B\u0E25\u0E27\u0E07\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32 \u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E43\u0E19\u0E1E\u0E23\u0E30\u0E17\u0E35\u0E48\u0E19\u0E31\u0E48\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27\u0E08\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E15\u0E31\u0E49\u0E07\u0E15\u0E31\u0E27 \u2014 \u0E17\u0E33\u0E43\u0E2B\u0E49\u0E27\u0E31\u0E14\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07", "paragraph2": "\u0E15\u0E25\u0E2D\u0E14\u0E01\u0E27\u0E48\u0E32\u0E2D\u0E23\u0E23\u0E15\u0E28\u0E15\u0E27\u0E23\u0E23\u0E29 \u0E27\u0E31\u0E14\u0E41\u0E2B\u0E48\u0E07\u0E19\u0E35\u0E49\u0E22\u0E31\u0E07\u0E04\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E01\u0E01\u0E32\u0E23\u0E30 \u0E21\u0E35\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E2A\u0E35\u0E02\u0E32\u0E27\u0E41\u0E25\u0E30\u0E40\u0E2A\u0E32\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01\u0E17\u0E35\u0E48\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E04\u0E27\u0E32\u0E21\u0E43\u0E01\u0E25\u0E49\u0E0A\u0E34\u0E14\u0E15\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E27\u0E31\u0E14\u0E43\u0E2B\u0E0D\u0E48 \u0E41\u0E21\u0E49\u0E08\u0E30\u0E40\u0E01\u0E47\u0E1A\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E2A\u0E2D\u0E07\u0E2D\u0E07\u0E04\u0E4C", "quote": "\u201C\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E43\u0E19\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E04\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E17\u0E35\u0E48\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E16\u0E37\u0E2D\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14\u201D", "quoteAuthor": "\u2014 \u0E1E\u0E07\u0E28\u0E32\u0E27\u0E14\u0E32\u0E23\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32", "etymology": { "tag": "\u0E04\u0E27\u0E32\u0E21\u0E2B\u0E21\u0E32\u0E22\u0E0A\u0E37\u0E48\u0E2D", "title": "\u201C\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u201D \u0E2B\u0E21\u0E32\u0E22\u0E16\u0E36\u0E07\u0E2D\u0E30\u0E44\u0E23", "text": "\u0E43\u0E19\u0E20\u0E32\u0E29\u0E32\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32/\u0E44\u0E17\u0E22 \u201CChiang\u201D (\u0E40\u0E0A\u0E35\u0E22\u0E07) \u0E2B\u0E21\u0E32\u0E22\u0E16\u0E36\u0E07 \u201C\u0E40\u0E21\u0E37\u0E2D\u0E07\u201D \u0E2A\u0E48\u0E27\u0E19 \u201CMan\u201D (\u0E21\u0E31\u0E48\u0E19) \u0E2B\u0E21\u0E32\u0E22\u0E16\u0E36\u0E07 \u201C\u0E21\u0E31\u0E48\u0E19\u0E04\u0E07 \u0E22\u0E31\u0E48\u0E07\u0E22\u0E37\u0E19\u201D \u201C\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u201D \u0E08\u0E36\u0E07\u0E41\u0E1B\u0E25\u0E27\u0E48\u0E32 \u201C\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E04\u0E07\u201D \u0E2A\u0E30\u0E17\u0E49\u0E2D\u0E19\u0E1E\u0E23\u0E30\u0E23\u0E32\u0E0A\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E02\u0E2D\u0E07\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E17\u0E35\u0E48\u0E08\u0E30\u0E43\u0E2B\u0E49\u0E23\u0E32\u0E0A\u0E18\u0E32\u0E19\u0E35\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E22\u0E31\u0E48\u0E07\u0E22\u0E37\u0E19" }, "stats": [{ "value": "1296", "label": "\u0E01\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07\u0E42\u0E14\u0E22\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22" }, { "value": "\u0E2D\u0E31\u0E19\u0E14\u0E31\u0E1A 1", "label": "\u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48" }, { "value": "05:00\u201319:00", "label": "\u0E40\u0E1B\u0E34\u0E14\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19" }], "highlights": [{ "tag": "\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27", "title": "\u0E1E\u0E23\u0E30\u0E41\u0E0B\u0E07\u0E15\u0E31\u0E07\u0E04\u0E21\u0E13\u0E35", "desc": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E1C\u0E25\u0E36\u0E01\u0E22\u0E38\u0E04\u0E17\u0E35\u0E48 11 \u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E27\u0E48\u0E32\u0E04\u0E38\u0E49\u0E21\u0E04\u0E23\u0E2D\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E41\u0E25\u0E30\u0E19\u0E33\u0E1D\u0E19" }, { "tag": "\u0E1E\u0E23\u0E30\u0E2B\u0E34\u0E19", "title": "\u0E1E\u0E23\u0E30\u0E2A\u0E35\u0E25\u0E32", "desc": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E2B\u0E34\u0E19\u0E17\u0E35\u0E48\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E42\u0E22\u0E07\u0E01\u0E31\u0E1A\u0E28\u0E23\u0E35\u0E25\u0E31\u0E07\u0E01\u0E32\u0E41\u0E25\u0E30\u0E24\u0E14\u0E39\u0E1D\u0E19" }, { "tag": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "title": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "desc": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\u0E2A\u0E2D\u0E07\u0E2D\u0E07\u0E04\u0E4C\u0E1A\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E0A\u0E49\u0E32\u0E07\u0E1B\u0E39\u0E19\u0E1B\u0E31\u0E49\u0E19" }], "editorTip": { "tag": "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23", "text": "\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22\u0E2A\u0E38\u0E20\u0E32\u0E1E \u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E43\u0E19\u0E42\u0E1A\u0E2A\u0E16\u0E4C \u0E41\u0E25\u0E30\u0E21\u0E32\u0E41\u0E15\u0E48\u0E40\u0E0A\u0E49\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E07\u0E1A", "ctaLabel": "\u0E14\u0E39\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33" } };
    arch$2 = { "label": "\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C", "heading": "\u0E28\u0E34\u0E25\u0E1B\u0E30\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E41\u0E2B\u0E48\u0E07\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32", "intro": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E04\u0E37\u0E2D\u0E1E\u0E34\u0E1E\u0E34\u0E18\u0E20\u0E31\u0E13\u0E11\u0E4C\u0E28\u0E34\u0E25\u0E1B\u0E30\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32\u0E02\u0E19\u0E32\u0E14\u0E01\u0E30\u0E17\u0E31\u0E14\u0E23\u0E31\u0E14 \u2014 \u0E15\u0E31\u0E49\u0E07\u0E41\u0E15\u0E48\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E44\u0E1B\u0E08\u0E19\u0E16\u0E36\u0E07\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E2A\u0E2D\u0E07\u0E2D\u0E07\u0E04\u0E4C", "treasuresTitle": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E2A\u0E2D\u0E07\u0E2D\u0E07\u0E04\u0E4C", "treasures": [{ "tag": "\u0E1E\u0E23\u0E30\u0E41\u0E0B\u0E07\u0E15\u0E31\u0E07\u0E04\u0E21\u0E13\u0E35", "title": "\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27", "text": "\u0E41\u0E01\u0E30\u0E2A\u0E25\u0E31\u0E01\u0E08\u0E32\u0E01\u0E1C\u0E25\u0E36\u0E01\u0E40\u0E14\u0E35\u0E22\u0E27 \u0E2A\u0E31\u0E19\u0E19\u0E34\u0E29\u0E10\u0E32\u0E19\u0E27\u0E48\u0E32\u0E21\u0E32\u0E08\u0E32\u0E01\u0E1E\u0E38\u0E17\u0E18\u0E28\u0E15\u0E27\u0E23\u0E23\u0E29\u0E17\u0E35\u0E48 11 \u0E40\u0E23\u0E35\u0E22\u0E01\u0E2D\u0E35\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E27\u0E48\u0E32\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27 \u0E19\u0E33\u0E41\u0E2B\u0E48\u0E43\u0E19\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E02\u0E2D\u0E1D\u0E19" }, { "tag": "\u0E1E\u0E23\u0E30\u0E2A\u0E35\u0E25\u0E32", "title": "\u0E1E\u0E23\u0E30\u0E2B\u0E34\u0E19", "text": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E25\u0E32\u0E22\u0E2A\u0E25\u0E31\u0E01\u0E1A\u0E19\u0E2B\u0E34\u0E19\u0E17\u0E23\u0E32\u0E22\u0E17\u0E35\u0E48\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E42\u0E22\u0E07\u0E01\u0E31\u0E1A\u0E28\u0E23\u0E35\u0E25\u0E31\u0E07\u0E01\u0E32 \u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E01\u0E31\u0E19\u0E21\u0E32\u0E19\u0E32\u0E19\u0E27\u0E48\u0E32\u0E21\u0E35\u0E2D\u0E34\u0E17\u0E18\u0E34\u0E1E\u0E25\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E1D\u0E19" }], "archTitle": "\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E04\u0E27\u0E23\u0E21\u0E2D\u0E07\u0E2B\u0E32", "architecture": [{ "title": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "desc": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21 (\u0E1E\u0E38\u0E17\u0E18\u0E28\u0E15\u0E27\u0E23\u0E23\u0E29\u0E17\u0E35\u0E48 13) \u0E15\u0E31\u0E49\u0E07\u0E1A\u0E19\u0E0A\u0E49\u0E32\u0E07\u0E1B\u0E39\u0E19\u0E1B\u0E31\u0E49\u0E19 \u2014 \u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A '\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19' \u0E17\u0E35\u0E48\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E2D\u0E01\u0E25\u0E31\u0E01\u0E29\u0E13\u0E4C \u0E23\u0E39\u0E49\u0E08\u0E31\u0E01\u0E43\u0E19\u0E20\u0E32\u0E29\u0E32\u0E0A\u0E48\u0E32\u0E07\u0E27\u0E48\u0E32 Chedi Chang Lom (\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E25\u0E49\u0E2D\u0E21)" }, { "title": "\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E2B\u0E25\u0E27\u0E07", "desc": "\u0E42\u0E1A\u0E2A\u0E16\u0E4C\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E25\u0E31\u0E01 \u0E2A\u0E23\u0E49\u0E32\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E43\u0E19\u0E17\u0E28\u0E27\u0E23\u0E23\u0E29 1920 \u0E1A\u0E19\u0E10\u0E32\u0E19\u0E40\u0E14\u0E34\u0E21 \u0E40\u0E2A\u0E32\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E22\u0E31\u0E07\u0E04\u0E07\u0E2D\u0E22\u0E39\u0E48" }, { "title": "\u0E2D\u0E38\u0E42\u0E1A\u0E2A\u0E16", "desc": "\u0E42\u0E1A\u0E2A\u0E16\u0E4C\u0E40\u0E25\u0E47\u0E01\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1E\u0E34\u0E18\u0E35\u0E2A\u0E07\u0E06\u0E4C \u0E15\u0E01\u0E41\u0E15\u0E48\u0E07\u0E44\u0E21\u0E49\u0E41\u0E1A\u0E1A\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32" }], "noteTag": "\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33", "noteText": "\u0E02\u0E2D\u0E07\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E17\u0E31\u0E49\u0E07\u0E2A\u0E2D\u0E07\u0E40\u0E01\u0E47\u0E1A\u0E43\u0E19\u0E2B\u0E2D\u0E44\u0E15\u0E23\u0E17\u0E32\u0E07\u0E02\u0E27\u0E32 \u0E2B\u0E32\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E0A\u0E21\u0E43\u0E01\u0E25\u0E49\u0E46 \u0E02\u0E2D\u0E23\u0E49\u0E2D\u0E07\u0E08\u0E32\u0E01\u0E1E\u0E23\u0E30\u0E44\u0E14\u0E49" };
    history$2 = { "label": "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34", "heading": "\u0E08\u0E32\u0E01\u0E04\u0E48\u0E32\u0E22\u0E2B\u0E25\u0E27\u0E07\u0E2A\u0E39\u0E48\u0E28\u0E39\u0E19\u0E22\u0E4C\u0E01\u0E25\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07", "headingEntity": "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E33\u0E04\u0E31\u0E0D\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "compareBefore": "\u0E14\u0E49\u0E32\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E2B\u0E25\u0E27\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "compareAfter": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "compareHint": "\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E41\u0E16\u0E1A\u0E0B\u0E49\u0E32\u0E22\u0E02\u0E27\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E17\u0E35\u0E22\u0E1A\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21", "intro": "\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E23\u0E32\u0E27\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E04\u0E37\u0E2D\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E23\u0E32\u0E27\u0E01\u0E32\u0E23\u0E01\u0E48\u0E2D\u0E01\u0E33\u0E40\u0E19\u0E34\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "blocks": [{ "date": "1296", "title": "\u0E04\u0E48\u0E32\u0E22\u0E2B\u0E25\u0E27\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22", "text": "\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E17\u0E23\u0E07\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E35\u0E48\u0E21\u0E31\u0E48\u0E19\u0E02\u0E13\u0E30\u0E2A\u0E16\u0E32\u0E1B\u0E19\u0E32\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E43\u0E19\u0E1E\u0E23\u0E30\u0E17\u0E35\u0E48\u0E19\u0E31\u0E48\u0E07\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27\u0E17\u0E35\u0E48\u0E15\u0E48\u0E2D\u0E21\u0E32\u0E40\u0E1B\u0E47\u0E19\u0E41\u0E01\u0E19\u0E01\u0E25\u0E32\u0E07\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14" }, { "date": "\u0E1E\u0E38\u0E17\u0E18\u0E28\u0E15\u0E27\u0E23\u0E23\u0E29 13\u201314", "title": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "text": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2A\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E35\u0E48\u0E22\u0E21\u0E1A\u0E19\u0E2B\u0E25\u0E31\u0E07\u0E0A\u0E49\u0E32\u0E07\u0E16\u0E39\u0E01\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E02\u0E36\u0E49\u0E19 \u0E01\u0E25\u0E32\u0E22\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A '\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19'" }, { "date": "\u0E17\u0E28\u0E27\u0E23\u0E23\u0E29 1920", "title": "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E43\u0E2B\u0E21\u0E48", "text": "\u0E42\u0E1A\u0E2A\u0E16\u0E4C\u0E2B\u0E25\u0E31\u0E07\u0E2B\u0E25\u0E31\u0E01\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E1A\u0E19\u0E23\u0E2D\u0E22\u0E40\u0E14\u0E34\u0E21 \u0E42\u0E14\u0E22\u0E40\u0E01\u0E47\u0E1A\u0E40\u0E2A\u0E32\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01\u0E42\u0E1A\u0E23\u0E32\u0E13" }, { "date": "\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19", "title": "\u0E27\u0E31\u0E14\u0E17\u0E35\u0E48\u0E21\u0E35\u0E0A\u0E35\u0E27\u0E34\u0E15", "text": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E22\u0E31\u0E07\u0E04\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E14\u0E17\u0E35\u0E48\u0E21\u0E35\u0E1E\u0E23\u0E30\u0E08\u0E33\u0E1E\u0E23\u0E23\u0E29\u0E32 \u0E41\u0E25\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E14\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E17\u0E35\u0E48\u0E1C\u0E39\u0E49\u0E04\u0E19\u0E19\u0E34\u0E22\u0E21\u0E21\u0E32\u0E40\u0E22\u0E37\u0E2D\u0E19" }], "legend": { "title": "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E40\u0E23\u0E35\u0E22\u0E01\u0E1D\u0E19", "text": "\u0E17\u0E31\u0E49\u0E07\u0E1E\u0E23\u0E30\u0E41\u0E0B\u0E07\u0E15\u0E31\u0E07\u0E04\u0E21\u0E13\u0E35\u0E41\u0E25\u0E30\u0E1E\u0E23\u0E30\u0E2A\u0E35\u0E25\u0E32 \u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E01\u0E31\u0E19\u0E27\u0E48\u0E32\u0E04\u0E27\u0E1A\u0E04\u0E38\u0E21\u0E1D\u0E19\u0E44\u0E14\u0E49 \u0E40\u0E04\u0E22\u0E2D\u0E31\u0E0D\u0E40\u0E0A\u0E34\u0E0D\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27\u0E41\u0E2B\u0E48\u0E02\u0E2D\u0E1D\u0E19\u0E43\u0E19\u0E22\u0E32\u0E21\u0E41\u0E25\u0E49\u0E07" }, "didYouKnow": { "title": "\u0E17\u0E23\u0E32\u0E1A\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?", "text": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E20\u0E32\u0E22\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E14\u0E49\u0E32\u0E19\u0E15\u0E30\u0E27\u0E31\u0E19\u0E15\u0E01\u0E40\u0E09\u0E35\u0E22\u0E07\u0E40\u0E2B\u0E19\u0E37\u0E2D \u2014 \u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E17\u0E35\u0E48\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E27\u0E32\u0E07\u0E1C\u0E31\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E04\u0E23\u0E31\u0E49\u0E07\u0E41\u0E23\u0E01" }, "folklore": { "title": "\u0E1C\u0E25\u0E36\u0E01\u0E17\u0E35\u0E48\u0E40\u0E23\u0E35\u0E22\u0E01\u0E1D\u0E19", "tale": "\u0E15\u0E33\u0E19\u0E32\u0E19\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19\u0E27\u0E48\u0E32 \u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27 '\u0E1E\u0E39\u0E14' \u0E1C\u0E48\u0E32\u0E19\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28 \u0E40\u0E21\u0E37\u0E48\u0E2D\u0E19\u0E33\u0E2D\u0E2D\u0E01\u0E41\u0E2B\u0E48\u0E43\u0E19\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C \u0E1F\u0E49\u0E32\u0E08\u0E30\u0E40\u0E1B\u0E34\u0E14\u0E41\u0E25\u0E30\u0E19\u0E32\u0E08\u0E30\u0E44\u0E14\u0E49\u0E14\u0E37\u0E48\u0E21", "shrineTitle": "\u0E17\u0E35\u0E48\u0E15\u0E31\u0E49\u0E07", "shrine": "\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27\u0E1B\u0E23\u0E30\u0E14\u0E34\u0E29\u0E10\u0E32\u0E19\u0E43\u0E19\u0E2B\u0E2D\u0E44\u0E15\u0E23\u0E17\u0E32\u0E07\u0E02\u0E27\u0E32 \u0E19\u0E33\u0E2D\u0E2D\u0E01\u0E43\u0E2B\u0E49\u0E0A\u0E21\u0E0A\u0E48\u0E27\u0E07\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C\u0E17\u0E38\u0E01\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19" } };
    guide$2 = { "label": "\u0E41\u0E19\u0E30\u0E19\u0E33\u0E01\u0E32\u0E23\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27", "heading": "\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E2A\u0E07\u0E1A\u0E41\u0E25\u0E30\u0E40\u0E04\u0E32\u0E23\u0E1E", "lead": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E40\u0E02\u0E49\u0E32\u0E1F\u0E23\u0E35 \u0E41\u0E25\u0E30\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E07\u0E48\u0E32\u0E22\u0E08\u0E32\u0E01\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32", "hub": { "t1": "\u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E41\u0E25\u0E30\u0E04\u0E48\u0E32\u0E40\u0E02\u0E49\u0E32", "t2": "\u0E01\u0E32\u0E23\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E41\u0E2A\u0E07", "t3": "\u0E21\u0E32\u0E23\u0E22\u0E32\u0E17\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22", "t4": "\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01" }, "hours": { "tag": "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E1B\u0E34\u0E14", "time": "05:00 \u2013 19:00", "items": [{ "label": "\u0E41\u0E2A\u0E07\u0E2A\u0E27\u0E22\u0E2A\u0E38\u0E14", "value": "06:00 \u2013 08:00" }, { "label": "\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E2A\u0E38\u0E14", "value": "\u0E40\u0E0A\u0E49\u0E32\u0E41\u0E25\u0E30\u0E2B\u0E25\u0E31\u0E07 17:00" }, { "label": "\u0E1B\u0E34\u0E14", "value": "\u0E44\u0E21\u0E48\u0E1B\u0E34\u0E14 (\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19)" }] }, "fees": { "tag": "\u0E04\u0E48\u0E32\u0E40\u0E02\u0E49\u0E32\u0E41\u0E25\u0E30\u0E17\u0E33\u0E1A\u0E38\u0E0D", "title": "\u0E04\u0E48\u0E32\u0E43\u0E0A\u0E49\u0E08\u0E48\u0E32\u0E22", "items": [{ "title": "\u0E40\u0E02\u0E49\u0E32\u0E27\u0E31\u0E14", "desc": "\u0E1F\u0E23\u0E35 \u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E40\u0E25\u0E47\u0E01\u0E19\u0E49\u0E2D\u0E22\u0E0A\u0E48\u0E27\u0E22\u0E1A\u0E33\u0E23\u0E38\u0E07\u0E27\u0E31\u0E14" }, { "title": "\u0E01\u0E32\u0E23\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22", "desc": "\u0E1B\u0E01\u0E1B\u0E34\u0E14\u0E44\u0E2B\u0E25\u0E48\u0E41\u0E25\u0E30\u0E2B\u0E31\u0E27\u0E40\u0E02\u0E48\u0E32 \u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E43\u0E19\u0E42\u0E1A\u0E2A\u0E16\u0E4C" }, { "title": "\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E", "desc": "\u0E44\u0E14\u0E49\u0E43\u0E19\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14 \u0E07\u0E14\u0E41\u0E1F\u0E25\u0E0A \u0E41\u0E25\u0E30\u0E2D\u0E22\u0E48\u0E32\u0E16\u0E48\u0E32\u0E22\u0E1E\u0E23\u0E30\u0E2B\u0E32\u0E01\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E02\u0E2D" }] }, "transport": { "tag": "\u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07", "title": "\u0E21\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E44\u0E23", "items": [{ "title": "\u0E08\u0E32\u0E01\u0E2A\u0E19\u0E32\u0E21\u0E1A\u0E34\u0E19", "desc": "\u0E2A\u0E19\u0E32\u0E21\u0E1A\u0E34\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 (CNX) \u0E2B\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 5 \u0E01\u0E21. \u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07:", "steps": ["\u0E21\u0E32\u0E16\u0E36\u0E07\u0E17\u0E35\u0E48\u0E2D\u0E32\u0E04\u0E32\u0E23\u0E1C\u0E39\u0E49\u0E42\u0E14\u0E22\u0E2A\u0E32\u0E23\u0E02\u0E32\u0E40\u0E02\u0E49\u0E32 (\u0E43\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28)", "\u0E40\u0E23\u0E35\u0E22\u0E01\u0E41\u0E17\u0E47\u0E01\u0E0B\u0E35\u0E48\u0E2A\u0E19\u0E32\u0E21\u0E1A\u0E34\u0E19\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E17\u0E32\u0E07\u0E2D\u0E2D\u0E01 1 \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E0A\u0E49\u0E41\u0E2D\u0E1B Grab/Bolt (\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 150\u2013200 \u0E1A\u0E32\u0E17)", "\u0E1A\u0E2D\u0E01\u0E04\u0E19\u0E02\u0E31\u0E1A\u0E27\u0E48\u0E32\u0E44\u0E1B '\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19' \u0E43\u0E19\u0E40\u0E02\u0E15\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32", "\u0E23\u0E16\u0E08\u0E30\u0E44\u0E1B\u0E2A\u0E48\u0E07\u0E16\u0E36\u0E07\u0E2B\u0E19\u0E49\u0E32\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E27\u0E31\u0E14\u0E1A\u0E19\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22"] }, { "title": "\u0E40\u0E14\u0E34\u0E19", "desc": "\u0E40\u0E14\u0E34\u0E19 10\u201315 \u0E19\u0E32\u0E17\u0E35\u0E08\u0E32\u0E01\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E17\u0E48\u0E32\u0E41\u0E1E" }, { "title": "\u0E23\u0E16\u0E2A\u0E2D\u0E07\u0E41\u0E16\u0E27\u0E41\u0E14\u0E07", "desc": "\u0E02\u0E36\u0E49\u0E19\u0E23\u0E16\u0E2A\u0E2D\u0E07\u0E41\u0E16\u0E27\u0E41\u0E14\u0E07 \u0E1A\u0E2D\u0E01\u0E04\u0E19\u0E02\u0E31\u0E1A '\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19' \u0E43\u0E01\u0E25\u0E49\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22" }, { "title": "\u0E15\u0E38\u0E4A\u0E01\u0E15\u0E38\u0E4A\u0E01 / Grab", "desc": "\u0E19\u0E31\u0E48\u0E07\u0E2A\u0E31\u0E49\u0E19\u0E46 \u0E08\u0E32\u0E01\u0E43\u0E08\u0E01\u0E25\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07" }] }, "photography": { "title": "\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E16\u0E48\u0E32\u0E22\u0E20\u0E32\u0E1E", "intro": "\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E2A\u0E35\u0E2D\u0E48\u0E2D\u0E19\u0E41\u0E25\u0E30\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01\u0E27\u0E32\u0E23\u0E4C\u0E21\u0E40\u0E1B\u0E25\u0E48\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E22\u0E22\u0E32\u0E21\u0E02\u0E2D\u0E1A\u0E27\u0E31\u0E19", "timesTitle": "\u0E41\u0E2A\u0E07\u0E2A\u0E27\u0E22\u0E2A\u0E38\u0E14", "times": [{ "period": "\u0E23\u0E38\u0E48\u0E07\u0E2D\u0E23\u0E38\u0E13", "desc": "\u0E41\u0E2A\u0E07\u0E19\u0E38\u0E48\u0E21 \u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E27\u0E48\u0E32\u0E07 \u0E40\u0E2B\u0E21\u0E32\u0E30\u0E01\u0E31\u0E1A\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07" }, { "period": "\u0E1A\u0E48\u0E32\u0E22", "desc": "\u0E41\u0E2A\u0E07\u0E15\u0E48\u0E33\u0E2A\u0E48\u0E2D\u0E07\u0E0A\u0E49\u0E32\u0E07\u0E1B\u0E39\u0E19\u0E1B\u0E31\u0E49\u0E19" }], "spotsTitle": "\u0E08\u0E38\u0E14\u0E16\u0E48\u0E32\u0E22", "spots": [{ "name": "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "view": "\u0E21\u0E2D\u0E07\u0E08\u0E32\u0E01\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E02\u0E36\u0E49\u0E19\u0E44\u0E1B\u0E17\u0E35\u0E48\u0E0A\u0E49\u0E32\u0E07", "tip": "\u0E16\u0E48\u0E32\u0E22\u0E21\u0E38\u0E21\u0E15\u0E48\u0E33\u0E43\u0E2B\u0E49\u0E40\u0E2B\u0E47\u0E19\u0E10\u0E32\u0E19\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C" }, { "name": "\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E27\u0E34\u0E2B\u0E32\u0E23", "view": "\u0E01\u0E23\u0E2D\u0E1A\u0E14\u0E49\u0E27\u0E22\u0E0A\u0E32\u0E22\u0E04\u0E32\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01", "tip": "\u0E23\u0E2D\u0E1E\u0E23\u0E30\u0E2B\u0E23\u0E37\u0E2D\u0E0A\u0E32\u0E27\u0E1A\u0E49\u0E32\u0E19\u0E40\u0E14\u0E34\u0E19\u0E1C\u0E48\u0E32\u0E19" }], "settingsTitle": "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32", "settings": [{ "style": "\u0E01\u0E27\u0E49\u0E32\u0E07 / \u0E17\u0E34\u0E27\u0E17\u0E31\u0E28\u0E19\u0E4C", "camera": "f/8, ISO 200, 16\u201324mm", "phone": "0.5\xD7 / 1\xD7 \u0E1B\u0E23\u0E31\u0E1A\u0E41\u0E2A\u0E07\u0E43\u0E2B\u0E49\u0E01\u0E33\u0E41\u0E1E\u0E07" }, { "style": "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14", "camera": "f/4, ISO 400, 50mm", "phone": "2\xD7 \u0E16\u0E37\u0E2D steady" }], "tipsTitle": "\u0E21\u0E32\u0E23\u0E22\u0E32\u0E17", "tips": ["\u0E2D\u0E22\u0E48\u0E32\u0E02\u0E36\u0E49\u0E19\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E1B\u0E35\u0E19", "\u0E40\u0E14\u0E34\u0E19\u0E2D\u0E49\u0E2D\u0E21\u0E44\u0E21\u0E48\u0E40\u0E2B\u0E22\u0E35\u0E22\u0E1A\u0E40\u0E2A\u0E37\u0E48\u0E2D\u0E41\u0E25\u0E30\u0E02\u0E2D\u0E07\u0E1A\u0E39\u0E0A\u0E32", "\u0E02\u0E2D\u0E42\u0E17\u0E29\u0E01\u0E48\u0E2D\u0E19\u0E16\u0E48\u0E32\u0E22\u0E04\u0E19\u0E44\u0E2B\u0E27\u0E49\u0E1E\u0E23\u0E30"] }, "bestTime": { "title": "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E17\u0E35\u0E48\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14", "intro": "\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E23\u0E49\u0E2D\u0E19\u0E15\u0E25\u0E2D\u0E14\u0E1B\u0E35 \u0E27\u0E31\u0E14\u0E2A\u0E27\u0E22\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E24\u0E14\u0E39\u0E2B\u0E19\u0E32\u0E27\u0E41\u0E25\u0E30\u0E41\u0E25\u0E49\u0E07", "seasons": [{ "tag": "\u0E2B\u0E19\u0E32\u0E27", "months": "\u0E1E.\u0E22.\u2013\u0E01.\u0E1E.", "name": "\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14", "desc": "\u0E40\u0E0A\u0E49\u0E32\u0E2A\u0E1A\u0E32\u0E22 \u0E41\u0E2A\u0E07\u0E0A\u0E31\u0E14 \u0E41\u0E25\u0E30\u0E43\u0E01\u0E25\u0E49\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C" }, { "tag": "\u0E23\u0E49\u0E2D\u0E19", "months": "\u0E21\u0E35.\u0E04.\u2013\u0E1E.\u0E04.", "name": "\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E41\u0E25\u0E30\u0E2A\u0E27\u0E48\u0E32\u0E07", "desc": "\u0E40\u0E17\u0E35\u0E48\u0E22\u0E07\u0E23\u0E49\u0E2D\u0E19\u0E08\u0E31\u0E14 \u2014 \u0E21\u0E32\u0E41\u0E15\u0E48\u0E40\u0E0A\u0E49\u0E32 \u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C\u0E21\u0E35\u0E02\u0E1A\u0E27\u0E19\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27" }, { "tag": "\u0E1D\u0E19", "months": "\u0E21\u0E34.\u0E22.\u2013\u0E15.\u0E04.", "name": "\u0E40\u0E02\u0E35\u0E22\u0E27\u0E41\u0E25\u0E30\u0E2A\u0E07\u0E1A", "desc": "\u0E1D\u0E19\u0E40\u0E22\u0E47\u0E19 \u0E04\u0E19\u0E19\u0E49\u0E2D\u0E22 \u0E2A\u0E27\u0E19\u0E27\u0E31\u0E14\u0E23\u0E48\u0E21\u0E23\u0E37\u0E48\u0E19" }] }, "safety": { "title": "\u0E04\u0E27\u0E32\u0E21\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E40\u0E04\u0E32\u0E23\u0E1E", "items": [{ "title": "\u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22\u0E2A\u0E38\u0E20\u0E32\u0E1E", "desc": "\u0E1B\u0E01\u0E1B\u0E34\u0E14\u0E44\u0E2B\u0E25\u0E48\u0E41\u0E25\u0E30\u0E2B\u0E31\u0E27\u0E40\u0E02\u0E48\u0E32 \u0E1C\u0E49\u0E32\u0E04\u0E25\u0E38\u0E21\u0E0A\u0E48\u0E27\u0E22\u0E44\u0E14\u0E49" }, { "title": "\u0E14\u0E39\u0E02\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E48\u0E32", "desc": "\u0E27\u0E31\u0E14\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E1B\u0E25\u0E2D\u0E14\u0E20\u0E31\u0E22 \u0E41\u0E15\u0E48\u0E0A\u0E48\u0E27\u0E07\u0E04\u0E19\u0E40\u0E22\u0E2D\u0E30\u0E23\u0E30\u0E27\u0E31\u0E07\u0E02\u0E2D\u0E07" }, { "title": "\u0E23\u0E30\u0E27\u0E31\u0E07\u0E41\u0E14\u0E14", "desc": "\u0E1E\u0E01\u0E19\u0E49\u0E33 \u2014 \u0E40\u0E17\u0E35\u0E48\u0E22\u0E07\u0E23\u0E49\u0E2D\u0E19\u0E08\u0E31\u0E14 \u0E21\u0E35.\u0E04.\u2013\u0E1E.\u0E04." }] }, "accessibility": { "title": "\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07", "intro": "\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14\u0E23\u0E32\u0E1A\u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1A\u0E31\u0E19\u0E44\u0E14\u0E19\u0E31\u0E01 \u0E20\u0E32\u0E22\u0E43\u0E19\u0E42\u0E1A\u0E2A\u0E16\u0E4C\u0E21\u0E35\u0E18\u0E23\u0E13\u0E35\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E1A\u0E49\u0E32\u0E07", "items": [{ "title": "\u0E17\u0E32\u0E07\u0E40\u0E14\u0E34\u0E19", "desc": "\u0E17\u0E32\u0E07\u0E40\u0E17\u0E49\u0E32\u0E1B\u0E39\u0E40\u0E23\u0E35\u0E22\u0E1A \u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E1B\u0E23\u0E30\u0E15\u0E39 \u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C \u0E41\u0E25\u0E30\u0E42\u0E1A\u0E2A\u0E16\u0E4C" }, { "title": "\u0E23\u0E16\u0E40\u0E02\u0E47\u0E19", "desc": "\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E44\u0E1B\u0E44\u0E14\u0E49 \u0E2A\u0E48\u0E27\u0E19\u0E43\u0E19\u0E42\u0E1A\u0E2A\u0E16\u0E4C\u0E04\u0E31\u0E1A\u0E41\u0E04\u0E1A \u2014 \u0E02\u0E2D\u0E1E\u0E23\u0E30\u0E0A\u0E48\u0E27\u0E22\u0E2B\u0E32\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23" }, { "title": "\u0E2A\u0E31\u0E07\u0E40\u0E01\u0E15\u0E1B\u0E49\u0E32\u0E22\u0E43\u0E19\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13", "desc": "\u0E42\u0E1A\u0E2A\u0E16\u0E4C (Ubosot) \u0E41\u0E25\u0E30\u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E28\u0E31\u0E01\u0E14\u0E34\u0E4C\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E2D\u0E32\u0E08\u0E08\u0E33\u0E01\u0E31\u0E14\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32 \u0E2B\u0E23\u0E37\u0E2D\u0E43\u0E2B\u0E49\u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32 \u2014 \u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E15\u0E32\u0E21\u0E1B\u0E49\u0E32\u0E22\u0E41\u0E25\u0E30\u0E04\u0E33\u0E41\u0E19\u0E30\u0E19\u0E33\u0E1E\u0E23\u0E30" }] }, "faqTitle": "\u0E19\u0E48\u0E32\u0E2A\u0E19\u0E43\u0E08", "faqs": [{ "q": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E17\u0E35\u0E48\u0E44\u0E2B\u0E19?", "a": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E15\u0E31\u0E49\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48 171 \u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22 \u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E15.\u0E28\u0E23\u0E35\u0E20\u0E39\u0E21\u0E34 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E08.\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 50200 \u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22 (18.7938, 98.9867) \u0E20\u0E32\u0E22\u0E43\u0E19\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07" }, { "q": "\u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E1F\u0E23\u0E35\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48?", "a": "\u0E1F\u0E23\u0E35 \u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E14\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E30 \u0E40\u0E1B\u0E34\u0E14\u0E43\u0E2B\u0E49\u0E40\u0E02\u0E49\u0E32\u0E0A\u0E21\u0E1F\u0E23\u0E35\u0E15\u0E25\u0E2D\u0E14\u0E1B\u0E35 \u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E44\u0E14\u0E49\u0E41\u0E15\u0E48\u0E44\u0E21\u0E48\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A" }, { "q": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E40\u0E01\u0E48\u0E32\u0E41\u0E04\u0E48\u0E44\u0E2B\u0E19?", "a": "\u0E01\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07\u0E1B\u0E35 1296 \u0E42\u0E14\u0E22\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22 \u0E40\u0E1B\u0E47\u0E19\u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48" }, { "q": "\u0E40\u0E02\u0E49\u0E32\u0E1F\u0E23\u0E35\u0E08\u0E23\u0E34\u0E07\u0E2B\u0E23\u0E37\u0E2D?", "a": "\u0E43\u0E0A\u0E48 \u0E1A\u0E23\u0E34\u0E08\u0E32\u0E04\u0E44\u0E14\u0E49\u0E41\u0E15\u0E48\u0E44\u0E21\u0E48\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A" }, { "q": "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E1B\u0E34\u0E14\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19?", "a": "\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14\u0E40\u0E1B\u0E34\u0E14\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13 05:00\u201319:00 \u0E19. \u0E44\u0E21\u0E48\u0E21\u0E35\u0E27\u0E31\u0E19\u0E1B\u0E34\u0E14" }, { "q": "\u0E40\u0E2B\u0E47\u0E19\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27\u0E44\u0E14\u0E49\u0E44\u0E2B\u0E21?", "a": "\u0E40\u0E01\u0E47\u0E1A\u0E43\u0E19\u0E2B\u0E2D\u0E44\u0E15\u0E23 \u0E19\u0E33\u0E2D\u0E2D\u0E01\u0E0A\u0E21\u0E0A\u0E48\u0E27\u0E07\u0E2A\u0E07\u0E01\u0E23\u0E32\u0E19\u0E15\u0E4C (\u0E40\u0E21.\u0E22.) \u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E37\u0E48\u0E19\u0E02\u0E2D\u0E1E\u0E23\u0E30\u0E44\u0E14\u0E49" }, { "q": "\u0E04\u0E27\u0E23\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E25\u0E32\u0E40\u0E17\u0E48\u0E32\u0E44\u0E23?", "a": "30\u201360 \u0E19\u0E32\u0E17\u0E35 \u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D\u0E0A\u0E21\u0E08\u0E38\u0E14\u0E2A\u0E33\u0E04\u0E31\u0E0D" }], "nearby": { "title": "\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32", "headingEntity": "\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30\u0E41\u0E25\u0E19\u0E14\u0E4C\u0E21\u0E32\u0E23\u0E4C\u0E01\u0E23\u0E2D\u0E1A\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "cluster": "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E32\u0E40\u0E22\u0E37\u0E2D\u0E19**\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19** \u0E19\u0E31\u0E01\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07\u0E15\u0E48\u0E2D\u0E44\u0E1B\u0E22\u0E31\u0E07\u0E41\u0E25\u0E19\u0E14\u0E4C\u0E21\u0E32\u0E23\u0E4C\u0E01\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E41\u0E25\u0E30\u0E08\u0E38\u0E14\u0E2A\u0E19\u0E43\u0E08\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07\u0E44\u0E14\u0E49\u0E07\u0E48\u0E32\u0E22 \u0E40\u0E0A\u0E48\u0E19 **\u0E27\u0E31\u0E14\u0E1E\u0E23\u0E30\u0E2A\u0E34\u0E07\u0E2B\u0E4C** \u0E41\u0E25\u0E30 **\u0E2D\u0E19\u0E38\u0E2A\u0E32\u0E27\u0E23\u0E35\u0E22\u0E4C\u0E2A\u0E32\u0E21\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C**", "items": [{ "name": "\u0E2D\u0E19\u0E38\u0E2A\u0E32\u0E27\u0E23\u0E35\u0E22\u0E4C\u0E2A\u0E32\u0E21\u0E01\u0E29\u0E31\u0E15\u0E23\u0E34\u0E22\u0E4C", "desc": "\u0E25\u0E32\u0E19\u0E01\u0E25\u0E32\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07 \u0E40\u0E14\u0E34\u0E19\u0E43\u0E15\u0E49 10 \u0E19\u0E32\u0E17\u0E35", "url": "https://maps.google.com/?q=Three+Kings+Monument+Chiang+Mai" }, { "name": "\u0E27\u0E31\u0E14\u0E1E\u0E23\u0E30\u0E2A\u0E34\u0E07\u0E2B\u0E4C", "desc": "\u0E27\u0E31\u0E14\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32\u0E43\u0E2B\u0E0D\u0E48 \u0E15\u0E30\u0E27\u0E31\u0E19\u0E15\u0E01 15 \u0E19\u0E32\u0E17\u0E35", "url": "https://maps.google.com/?q=Wat+Phra+Singh+Chiang+Mai" }, { "name": "\u0E16\u0E19\u0E19\u0E04\u0E19\u0E40\u0E14\u0E34\u0E19\u0E27\u0E31\u0E19\u0E2D\u0E32\u0E17\u0E34\u0E15\u0E22\u0E4C", "desc": "\u0E15\u0E25\u0E32\u0E14\u0E19\u0E31\u0E14\u0E22\u0E32\u0E21\u0E04\u0E48\u0E33 \u0E1A\u0E19\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19", "url": "https://maps.google.com/?q=Sunday+Walking+Street+Chiang+Mai" }], "cta": "\u0E14\u0E39\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21" } };
    food$2 = { "label": "\u0E02\u0E2D\u0E07\u0E01\u0E34\u0E19\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07", "heading": "\u0E01\u0E34\u0E19\u0E41\u0E1A\u0E1A\u0E04\u0E19\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19", "lead": "\u0E0B\u0E2D\u0E22\u0E23\u0E2D\u0E1A\u0E27\u0E31\u0E14\u0E40\u0E15\u0E47\u0E21\u0E44\u0E1B\u0E14\u0E49\u0E27\u0E22\u0E04\u0E32\u0E40\u0E1F\u0E48 \u0E23\u0E49\u0E32\u0E19\u0E01\u0E4B\u0E27\u0E22\u0E40\u0E15\u0E35\u0E4B\u0E22\u0E27 \u0E41\u0E25\u0E30\u0E04\u0E23\u0E31\u0E27\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E40\u0E2B\u0E19\u0E37\u0E2D", "dishes": [{ "tag": "\u0E01\u0E4B\u0E27\u0E22\u0E40\u0E15\u0E35\u0E4B\u0E22\u0E27", "name": "\u0E02\u0E49\u0E32\u0E27\u0E0B\u0E2D\u0E22", "price": "\u0E3F50\u201370", "desc": "\u0E01\u0E4B\u0E27\u0E22\u0E40\u0E15\u0E35\u0E4B\u0E22\u0E27\u0E41\u0E01\u0E07\u0E40\u0E08\u0E49\u0E32\u0E40\u0E14\u0E47\u0E14\u0E02\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E25\u0E2D\u0E07\u0E17\u0E35\u0E48\u0E23\u0E49\u0E32\u0E19\u0E1A\u0E19\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22" }, { "tag": "\u0E44\u0E2A\u0E49\u0E01\u0E23\u0E2D\u0E01", "name": "\u0E44\u0E2A\u0E49\u0E2D\u0E31\u0E48\u0E27", "price": "\u0E3F60", "desc": "\u0E44\u0E2A\u0E49\u0E01\u0E23\u0E2D\u0E01\u0E2B\u0E21\u0E39\u0E1B\u0E23\u0E38\u0E07\u0E2A\u0E21\u0E38\u0E19\u0E44\u0E1E\u0E23 \u0E40\u0E1C\u0E32\u0E40\u0E2A\u0E34\u0E23\u0E4C\u0E1F\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E1E\u0E23\u0E34\u0E01" }, { "tag": "\u0E02\u0E19\u0E21", "name": "\u0E02\u0E19\u0E21\u0E04\u0E23\u0E01", "price": "\u0E3F30", "desc": "\u0E02\u0E19\u0E21\u0E19\u0E49\u0E33\u0E01\u0E30\u0E17\u0E34 \u0E01\u0E23\u0E2D\u0E1A\u0E19\u0E2D\u0E01 \u0E19\u0E38\u0E48\u0E21\u0E43\u0E19" }, { "tag": "\u0E01\u0E32\u0E41\u0E1F", "name": "\u0E04\u0E32\u0E40\u0E1F\u0E48\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32", "price": "\u0E3F50\u201390", "desc": "\u0E04\u0E32\u0E40\u0E1F\u0E48\u0E25\u0E32\u0E19\u0E40\u0E07\u0E35\u0E22\u0E1A \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E2D\u0E32\u0E2B\u0E32\u0E23\u0E40\u0E0A\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19\u0E27\u0E31\u0E14" }], "quote": { "text": "\u201C\u0E02\u0E49\u0E32\u0E27\u0E0B\u0E2D\u0E22\u0E17\u0E35\u0E48\u0E14\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32\u0E2D\u0E22\u0E39\u0E48\u0E2B\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E1B\u0E23\u0E30\u0E15\u0E39\u0E27\u0E31\u0E14\u0E2B\u0E49\u0E32\u0E19\u0E32\u0E17\u0E35\u201D", "author": "\u2014 \u0E04\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48" } };
    gallery$2 = { "label": "\u0E41\u0E01\u0E25\u0E40\u0E25\u0E2D\u0E23\u0E35", "heading": "\u0E20\u0E32\u0E22\u0E43\u0E19\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "intro": "\u0E40\u0E14\u0E34\u0E19\u0E0A\u0E21\u0E42\u0E1A\u0E2A\u0E16\u0E4C \u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C \u0E41\u0E25\u0E30\u0E21\u0E38\u0E21\u0E2A\u0E07\u0E1A\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14", "credits": "\u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E47\u0E19 illustrative \u0E02\u0E2D\u0E07\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E27\u0E31\u0E14", "alts": ["\u0E1A\u0E23\u0E34\u0E40\u0E27\u0E13\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E27\u0E34\u0E2B\u0E32\u0E23\u0E2A\u0E35\u0E02\u0E32\u0E27", "\u0E40\u0E2A\u0E32\u0E44\u0E21\u0E49\u0E2A\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E42\u0E1A\u0E2A\u0E16\u0E4C", "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07", "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E0A\u0E49\u0E32\u0E07\u0E1B\u0E39\u0E19\u0E1B\u0E31\u0E49\u0E19", "\u0E1E\u0E23\u0E30\u0E1E\u0E38\u0E17\u0E18\u0E23\u0E39\u0E1B\u0E17\u0E2D\u0E07", "\u0E2B\u0E19\u0E49\u0E32\u0E1A\u0E31\u0E19\u0E42\u0E1A\u0E2A\u0E16\u0E4C", "\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14", "\u0E0A\u0E32\u0E22\u0E04\u0E32\u0E44\u0E21\u0E49\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32", "\u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E27\u0E14\u0E21\u0E19\u0E15\u0E4C", "\u0E1E\u0E23\u0E30\u0E2A\u0E35\u0E25\u0E32", "\u0E21\u0E38\u0E02\u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27", "\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E1A\u0E19\u0E1F\u0E49\u0E32\u0E04\u0E23\u0E32\u0E21", "\u0E01\u0E38\u0E0F\u0E34\u0E1E\u0E23\u0E30", "\u0E2A\u0E27\u0E19\u0E27\u0E31\u0E14", "\u0E23\u0E32\u0E27\u0E1A\u0E31\u0E19\u0E44\u0E14\u0E19\u0E32\u0E04", "\u0E25\u0E27\u0E14\u0E25\u0E32\u0E22\u0E2B\u0E19\u0E49\u0E32\u0E08\u0E31\u0E48\u0E27", "\u0E2B\u0E2D\u0E23\u0E30\u0E06\u0E31\u0E07", "\u0E41\u0E2A\u0E07\u0E40\u0E22\u0E47\u0E19\u0E1A\u0E19\u0E01\u0E33\u0E41\u0E1E\u0E07", "\u0E28\u0E34\u0E29\u0E22\u0E4C\u0E08\u0E38\u0E14\u0E18\u0E39\u0E1B", "\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07", "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E42\u0E04\u0E21", "\u0E21\u0E38\u0E21\u0E2A\u0E07\u0E1A\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14"], "viewLocation": "\u0E14\u0E39\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E1A\u0E19 Google Maps" };
    reviews$2 = { "label": "\u0E23\u0E35\u0E27\u0E34\u0E27", "heading": "\u0E2A\u0E34\u0E48\u0E07\u0E17\u0E35\u0E48\u0E1C\u0E39\u0E49\u0E04\u0E19\u0E1E\u0E39\u0E14", "intro": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E44\u0E14\u0E49\u0E04\u0E30\u0E41\u0E19\u0E19\u0E2A\u0E39\u0E07\u0E40\u0E2A\u0E21\u0E2D\u0E08\u0E32\u0E01\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E2A\u0E07\u0E1A\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E07\u0E14\u0E07\u0E32\u0E21\u0E17\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C", "disclaimer": "\u0E04\u0E30\u0E41\u0E19\u0E19\u0E2A\u0E23\u0E38\u0E1B\u0E08\u0E32\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E30 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1A\u0E37\u0E49\u0E2D\u0E07\u0E15\u0E49\u0E19", "declaration": "\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E2D\u0E34\u0E2A\u0E23\u0E30 \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14\u0E01\u0E31\u0E1A\u0E27\u0E31\u0E14\u0E2B\u0E23\u0E37\u0E2D Google", "sourceNote": "\u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E08\u0E32\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Google Maps \u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 \u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19 2026 \u0E25\u0E34\u0E02\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E35\u0E22\u0E19\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A\u0E41\u0E25\u0E30 Google Maps", "sourceNotesLabel": "\u0E23\u0E35\u0E27\u0E34\u0E27 \xB7 \u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 \u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19 2026", "viewAllCta": "\u0E14\u0E39\u0E23\u0E35\u0E27\u0E34\u0E27\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E1A\u0E19 Google Maps", "featured": [{ "text": "\u201C\u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E41\u0E25\u0E30\u0E2A\u0E07\u0E1A\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u2014 \u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E19\u0E48\u0E32\u0E1B\u0E23\u0E30\u0E17\u0E31\u0E1A\u0E43\u0E08\u201D", "source": "\u0E23\u0E35\u0E27\u0E34\u0E27 Google" }, { "text": "\u201C\u0E21\u0E32\u0E41\u0E15\u0E48\u0E40\u0E0A\u0E49\u0E32 \u0E40\u0E23\u0E32\u0E21\u0E35\u0E25\u0E32\u0E19\u0E27\u0E31\u0E14\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27 \u0E41\u0E25\u0E30\u0E41\u0E2A\u0E07\u0E1A\u0E19\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E02\u0E32\u0E27\u0E2A\u0E27\u0E22\u0E21\u0E32\u0E01\u201D", "source": "\u0E23\u0E35\u0E27\u0E34\u0E27 Google" }], "items": [{ "text": "\u0E40\u0E25\u0E47\u0E01\u0E41\u0E15\u0E48\u0E40\u0E15\u0E47\u0E21\u0E44\u0E1B\u0E14\u0E49\u0E27\u0E22\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C \u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27\u0E21\u0E2B\u0E31\u0E28\u0E08\u0E23\u0E23\u0E22\u0E4C", "rating": "5", "name": "Anya R.", "date": "\u0E21\u0E35.\u0E04. 2026" }, { "text": "\u0E0A\u0E2D\u0E1A\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07 \u2014 \u0E44\u0E21\u0E48\u0E40\u0E2B\u0E21\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E44\u0E2B\u0E19\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "rating": "5", "name": "Tom B.", "date": "\u0E01.\u0E1E. 2026" }, { "text": "\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E41\u0E25\u0E30\u0E14\u0E39\u0E41\u0E25\u0E14\u0E35 \u0E40\u0E2B\u0E21\u0E32\u0E30\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E38\u0E14\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19\u0E40\u0E0A\u0E49\u0E32", "rating": "4", "name": "Lin W.", "date": "\u0E21.\u0E04. 2026" }], "viewLocation": "\u0E14\u0E39\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E1A\u0E19 Google Maps" };
    sources$2 = { "label": "\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E17\u0E35\u0E48\u0E21\u0E32", "heading": "\u0E17\u0E35\u0E48\u0E21\u0E32\u0E02\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", "intro": "\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07\u0E2B\u0E25\u0E31\u0E01\u0E08\u0E32\u0E01\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E2A\u0E32\u0E18\u0E32\u0E23\u0E13\u0E30 \u0E20\u0E32\u0E1E\u0E40\u0E1B\u0E47\u0E19 illustrative \u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14", "photoTitle": "\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15\u0E20\u0E32\u0E1E", "reviewTitle": "\u0E23\u0E35\u0E27\u0E34\u0E27", "reviewNote": "\u0E23\u0E35\u0E27\u0E34\u0E27 \xB7 \u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14 \u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19 2026 \u2014 \u0E0B\u0E34\u0E07\u0E01\u0E4C\u0E08\u0E32\u0E01\u0E23\u0E35\u0E27\u0E34\u0E27\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 Google Maps \u0E25\u0E34\u0E02\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E1B\u0E47\u0E19\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E40\u0E02\u0E35\u0E22\u0E19\u0E15\u0E49\u0E19\u0E09\u0E1A\u0E31\u0E1A\u0E41\u0E25\u0E30 Google Maps \u0E23\u0E35\u0E27\u0E34\u0E27\u0E41\u0E2A\u0E14\u0E07\u0E1A\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 \u0E41\u0E25\u0E30\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E23\u0E27\u0E21\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E21\u0E35\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32", "reviewLinkLabel": "\u0E14\u0E39\u0E23\u0E35\u0E27\u0E34\u0E27\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E1A\u0E19 Google Maps", "weatherTitle": "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E41\u0E25\u0E30\u0E20\u0E39\u0E21\u0E34\u0E2D\u0E32\u0E01\u0E32\u0E28", "weatherText": "\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19\u0E41\u0E25\u0E30\u0E1E\u0E22\u0E32\u0E01\u0E23\u0E13\u0E4C 7 \u0E27\u0E31\u0E19 \u0E04\u0E33\u0E19\u0E27\u0E13\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1E\u0E34\u0E01\u0E31\u0E14\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E42\u0E14\u0E22\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E1E\u0E22\u0E32\u0E01\u0E23\u0E13\u0E4C Open-Meteo \u0E04\u0E48\u0E32\u0E1B\u0E01\u0E15\u0E34\u0E23\u0E32\u0E22\u0E24\u0E14\u0E39\u0E01\u0E32\u0E25\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E0A\u0E48\u0E27\u0E07\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 WMO 1991\u20132020 \u0E02\u0E2D\u0E07\u0E2A\u0E16\u0E32\u0E19\u0E35\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E41\u0E19\u0E27\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E20\u0E31\u0E22\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23 \u2014 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E15\u0E32\u0E21\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28\u0E17\u0E49\u0E2D\u0E07\u0E16\u0E34\u0E48\u0E19\u0E43\u0E19\u0E2A\u0E20\u0E32\u0E1E\u0E2D\u0E32\u0E01\u0E32\u0E28\u0E23\u0E38\u0E19\u0E41\u0E23\u0E07", "govTitle": "\u0E1E\u0E2D\u0E23\u0E4C\u0E17\u0E31\u0E25\u0E01\u0E32\u0E23\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23", "govText": "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E23\u0E30\u0E14\u0E31\u0E1A\u0E20\u0E39\u0E21\u0E34\u0E20\u0E32\u0E04 \u0E42\u0E1B\u0E23\u0E14\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E1E\u0E2D\u0E23\u0E4C\u0E17\u0E31\u0E25\u0E01\u0E32\u0E23\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E44\u0E17\u0E22 / \u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "govLinkLabel": "\u0E1E\u0E2D\u0E23\u0E4C\u0E17\u0E31\u0E25\u0E01\u0E32\u0E23\u0E17\u0E48\u0E2D\u0E07\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23", "photoItems": [{ "text": "\u0E20\u0E32\u0E1E\u0E41\u0E01\u0E25\u0E40\u0E25\u0E2D\u0E23\u0E35\u0E40\u0E1B\u0E47\u0E19 illustrative \u0E02\u0E2D\u0E07\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21\u0E41\u0E25\u0E30\u0E1A\u0E23\u0E23\u0E22\u0E32\u0E01\u0E32\u0E28\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "linkLabel": "\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07", "url": "https://en.wikipedia.org/wiki/Wat_Chiang_Man" }], "factTitle": "\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07\u0E41\u0E25\u0E30\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A", "factText": "\u0E27\u0E31\u0E19\u0E01\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07 \u0E1E\u0E23\u0E30\u0E41\u0E01\u0E49\u0E27\u0E02\u0E32\u0E27\u0E41\u0E25\u0E30\u0E1E\u0E23\u0E30\u0E2B\u0E34\u0E19 \u0E41\u0E25\u0E30\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2D\u0E07\u0E04\u0E4C\u0E0A\u0E49\u0E32\u0E07 \u0E15\u0E32\u0E21\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E17\u0E35\u0E48\u0E40\u0E1C\u0E22\u0E41\u0E1E\u0E23\u0E48\u0E01\u0E31\u0E19", "correctionTitle": "\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14?", "correctionText": "\u0E2B\u0E32\u0E01\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E1C\u0E34\u0E14 \u0E40\u0E23\u0E32\u0E22\u0E34\u0E19\u0E14\u0E35\u0E41\u0E01\u0E49\u0E44\u0E02", "correctionMailto": "mailto:n20186005@gmail.com", "correctionCta": "\u0E2A\u0E48\u0E07\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E41\u0E08\u0E49\u0E07\u0E41\u0E01\u0E49\u0E44\u0E02", "copyright": "\xA9 2026 \u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E41\u0E2B\u0E25\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2D\u0E34\u0E2A\u0E23\u0E30" };
    mapSection$2 = { "label": "\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07", "heading": "\u0E2B\u0E32\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "headingEntity": "\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07\u0E41\u0E25\u0E30\u0E27\u0E34\u0E18\u0E35\u0E40\u0E22\u0E35\u0E48\u0E22\u0E21\u0E0A\u0E21\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48", "lead": "\u0E17\u0E32\u0E07\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E17\u0E35\u0E48\u0E40\u0E07\u0E35\u0E22\u0E1A\u0E2A\u0E07\u0E1A\u0E02\u0E2D\u0E07\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E1A\u0E19\u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22 \u0E2B\u0E48\u0E32\u0E07\u0E08\u0E32\u0E01\u0E04\u0E39\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E14\u0E34\u0E19\u0E44\u0E21\u0E48\u0E01\u0E35\u0E48\u0E19\u0E32\u0E17\u0E35", "stats": [{ "tag": "\u0E04\u0E30\u0E41\u0E19\u0E19", "value": "4.7", "sub": "6,192 \u0E23\u0E35\u0E27\u0E34\u0E27" }, { "tag": "\u0E40\u0E1B\u0E34\u0E14", "value": "05:00\u201319:00", "sub": "\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19" }, { "tag": "\u0E01\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07", "value": "1296", "sub": "\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22" }], "address": "171 \u0E16\u0E19\u0E19\u0E23\u0E32\u0E0A\u0E20\u0E32\u0E04\u0E44\u0E0A\u0E22 \u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32 \u0E15.\u0E28\u0E23\u0E35\u0E20\u0E39\u0E21\u0E34 \u0E2D.\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E08.\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 50200", "plusCode": "QXVQ+GP", "coords": "18.7938, 98.9867" };
    footer$2 = { "brand": { "name": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19", "tagline": "\u0E27\u0E31\u0E14\u0E40\u0E01\u0E48\u0E32\u0E41\u0E01\u0E48\u0E17\u0E35\u0E48\u0E2A\u0E38\u0E14\u0E43\u0E19\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \xB7 \u0E01\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07 1296" }, "about": "\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E2D\u0E34\u0E2A\u0E23\u0E30\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 (Wat Chiang Man) \u2014 \u0E27\u0E31\u0E14\u0E41\u0E23\u0E01\u0E02\u0E2D\u0E07\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E43\u0E2B\u0E21\u0E48 \u0E01\u0E48\u0E2D\u0E15\u0E31\u0E49\u0E07\u0E42\u0E14\u0E22\u0E1E\u0E48\u0E2D\u0E02\u0E38\u0E19\u0E40\u0E21\u0E47\u0E07\u0E23\u0E32\u0E22\u0E1B\u0E35 1296", "navTitle": "\u0E2A\u0E33\u0E23\u0E27\u0E08", "navItems": [{ "label": "\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A", "href": "#about" }, { "label": "\u0E2A\u0E16\u0E32\u0E1B\u0E31\u0E15\u0E22\u0E01\u0E23\u0E23\u0E21", "href": "#arch" }, { "label": "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34", "href": "#history" }, { "label": "\u0E41\u0E19\u0E30\u0E19\u0E33\u0E01\u0E32\u0E23\u0E40\u0E17\u0E35\u0E48\u0E22\u0E27", "href": "#guide" }, { "label": "\u0E41\u0E01\u0E25\u0E40\u0E25\u0E2D\u0E23\u0E35", "href": "#gallery" }, { "label": "\u0E23\u0E35\u0E27\u0E34\u0E27", "href": "#reviews" }, { "label": "\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48", "href": "#map" }], "noteTitle": "\u0E04\u0E27\u0E23\u0E23\u0E39\u0E49", "note": "\u0E40\u0E02\u0E49\u0E32\u0E1F\u0E23\u0E35 \u0E17\u0E38\u0E01\u0E27\u0E31\u0E19 05:00\u201319:00 \u0E41\u0E15\u0E48\u0E07\u0E01\u0E32\u0E22\u0E2A\u0E38\u0E20\u0E32\u0E1E\u0E41\u0E25\u0E30\u0E16\u0E2D\u0E14\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E43\u0E19\u0E42\u0E1A\u0E2A\u0E16\u0E4C", "mapsLabel": "Google Maps \u2192", "sourcesTitle": "\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E17\u0E35\u0E48\u0E21\u0E32", "sourcesNote": "\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07\u0E08\u0E32\u0E01\u0E41\u0E2B\u0E25\u0E48\u0E07\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 \u0E20\u0E32\u0E1E illustrative", "privacy": "\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27", "terms": "\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02", "cookies": "\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49", "verified": { "label": "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E19\u0E37\u0E49\u0E2D\u0E2B\u0E32", "text": "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E21\u0E35\u0E19\u0E32\u0E04\u0E21 2026 \xB7 \u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E02\u0E49\u0E2D\u0E40\u0E17\u0E47\u0E08\u0E08\u0E23\u0E34\u0E07: \u0E2B\u0E2D\u0E08\u0E14\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E28\u0E32\u0E2A\u0E15\u0E23\u0E4C\u0E25\u0E49\u0E32\u0E19\u0E19\u0E32" }, "disclaimerLead": "\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E2D\u0E34\u0E2A\u0E23\u0E30", "unofficial": "\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E31\u0E1A\u0E23\u0E2D\u0E07\u0E42\u0E14\u0E22\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E2B\u0E23\u0E37\u0E2D Google", "dataSource": "\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E30\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48: Google Maps", "copyright": "\xA9 2026 \u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E2A\u0E07\u0E27\u0E19\u0E25\u0E34\u0E02\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C" };
    legal$2 = { "privacy": { "title": "\u0E19\u0E42\u0E22\u0E1A\u0E32\u0E22\u0E04\u0E27\u0E32\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27", "updated": "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14: 2026", "sections": [{ "h": "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E40\u0E23\u0E32\u0E40\u0E01\u0E47\u0E1A", "p": "\u0E40\u0E23\u0E32\u0E44\u0E21\u0E48\u0E40\u0E01\u0E47\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E1A\u0E38\u0E04\u0E04\u0E25 \u0E40\u0E27\u0E49\u0E19\u0E41\u0E15\u0E48\u0E04\u0E38\u0E13\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E21\u0E32 \u0E2D\u0E32\u0E08\u0E43\u0E0A\u0E49\u0E2A\u0E16\u0E34\u0E15\u0E34\u0E23\u0E27\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E40\u0E27\u0E47\u0E1A" }, { "h": "\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49", "p": "\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E14\u0E08\u0E33\u0E20\u0E32\u0E29\u0E32\u0E41\u0E25\u0E30\u0E04\u0E27\u0E32\u0E21\u0E22\u0E34\u0E19\u0E22\u0E2D\u0E21 \u0E44\u0E21\u0E48\u0E15\u0E31\u0E49\u0E07\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49\u0E42\u0E06\u0E29\u0E13\u0E32\u0E42\u0E14\u0E22\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15" }, { "h": "\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13", "p": "\u0E04\u0E38\u0E13\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E02\u0E2D\u0E43\u0E2B\u0E49\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E41\u0E0A\u0E23\u0E4C\u0E01\u0E31\u0E1A\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49" }] }, "terms": { "title": "\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19", "updated": "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14: 2026", "sections": [{ "h": "\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E40\u0E27\u0E47\u0E1A", "p": "\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D\u0E2D\u0E34\u0E2A\u0E23\u0E30\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B \u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E48\u0E2D\u0E19\u0E40\u0E14\u0E34\u0E19\u0E17\u0E32\u0E07" }, { "h": "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E31\u0E21\u0E1E\u0E31\u0E19\u0E18\u0E4C", "p": "\u0E40\u0E23\u0E32\u0E44\u0E21\u0E48\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14\u0E01\u0E31\u0E1A\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \u0E2B\u0E23\u0E37\u0E2D\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E2D\u0E49\u0E32\u0E07\u0E16\u0E36\u0E07" }, { "h": "\u0E04\u0E27\u0E32\u0E21\u0E23\u0E31\u0E1A\u0E1C\u0E34\u0E14", "p": "\u0E43\u0E0A\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E32\u0E21\u0E04\u0E27\u0E32\u0E21\u0E40\u0E2A\u0E35\u0E48\u0E22\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13" }] }, "cookies": { "title": "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49", "updated": "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E25\u0E48\u0E32\u0E2A\u0E38\u0E14: 2026", "intro": "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49\u0E02\u0E2D\u0E07\u0E40\u0E27\u0E47\u0E1A", "categories": [{ "h": "\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19", "status": "\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E2A\u0E21\u0E2D", "p": "\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E17\u0E33\u0E07\u0E32\u0E19\u0E02\u0E2D\u0E07\u0E40\u0E27\u0E47\u0E1A\u0E41\u0E25\u0E30\u0E08\u0E14\u0E08\u0E33\u0E20\u0E32\u0E29\u0E32", "sub": "", "subStatus": "" }, { "h": "\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32", "status": "\u0E40\u0E1B\u0E34\u0E14\u0E15\u0E32\u0E21\u0E04\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21", "p": "\u0E08\u0E14\u0E08\u0E33\u0E01\u0E32\u0E23\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E04\u0E38\u0E01\u0E01\u0E35\u0E49\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13", "sub": "", "subStatus": "" }, { "h": "\u0E2A\u0E16\u0E34\u0E15\u0E34", "status": "\u0E1B\u0E34\u0E14\u0E15\u0E32\u0E21\u0E04\u0E48\u0E32\u0E40\u0E14\u0E34\u0E21", "p": "\u0E2A\u0E16\u0E34\u0E15\u0E34\u0E23\u0E27\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E04\u0E39\u0E48\u0E21\u0E37\u0E2D", "sub": "", "subStatus": "" }], "consent": "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32" } };
    th = {
      meta: meta$2,
      sync: sync$2,
      imageCopyright: imageCopyright$2,
      breadcrumb: breadcrumb$2,
      header: header$2,
      weather: weather$2,
      seasons: seasons$2,
      routes: routes$2,
      itinerary: itinerary$2,
      facilities: facilities$2,
      responsibility: responsibility$2,
      legends: legends$2,
      hero: hero$2,
      about: about$2,
      arch: arch$2,
      history: history$2,
      guide: guide$2,
      food: food$2,
      gallery: gallery$2,
      reviews: reviews$2,
      sources: sources$2,
      mapSection: mapSection$2,
      footer: footer$2,
      legal: legal$2
    };
    meta$1 = { "title": "Wat Chiang Man Chiang Mai: Oldest Temple - Free Entry & Hours", "description": "Visit Wat Chiang Man, Chiang Mai's oldest temple, founded in 1296 by King Mangrai. Free entry, open daily 05:00-19:00, dress code, the elephant chedi, crystal & stone Buddha, and how to get there.", "ogTitle": "Wat Chiang Man - Chiang Mai's Oldest Temple (Est. 1296)", "ogDescription": "Free-entry temple in Chiang Mai's Old City: opening hours, dress code, the elephant-backed chedi, the crystal and stone Buddhas, and walking directions from Tha Phae Gate." };
    sync$1 = { "time": "September 2026", "reviewsFrom": "Reviews come from Google Maps user reviews", "viewAll": "See all reviews on Google Maps", "ratingNote": "Rating & review count synced from Google Maps user reviews", "reviewsNote": "Synced from Google Maps user reviews, synced September 2026; copyright belongs to the original authors and Google Maps.", "reviewsCta": "See all reviews on Google Maps" };
    imageCopyright$1 = "All images shown on this website remain the property and copyright of their original photographers.";
    breadcrumb$1 = { "label": "Breadcrumb", "items": [{ "name": "Wat Chiang Man" }, { "name": "Chiang Mai" }, { "name": "Chiang Mai Province" }, { "name": "Thailand" }] };
    header$1 = { "home": "Home", "about": "About", "arch": "Architecture", "legends": "Legends", "history": "History", "weather": "Weather", "seasons": "Seasons", "guide": "Visitor Guide", "routes": "Routes", "itinerary": "Itineraries", "food": "Nearby Eats", "gallery": "Gallery", "facilities": "Facilities", "responsibility": "Responsibility", "reviews": "Reviews", "map": "Map" };
    weather$1 = { "label": "Plan your visit", "heading": "Weather in Chiang Mai right now", "intro": "The old city sits in a tropical savanna belt: hot days, a clear rainy season, and a hazy spell in late winter. Check today's conditions before you set out on foot.", "nowLabel": "Current conditions", "feelsLike": "Feels like", "humidity": "Humidity", "wind": "Wind", "windUnit": "km/h", "rainChance": "Rain today", "umbrellaTitle": "Do I need an umbrella?", "umbrellaYes": "Yes \u2014 rain is likely today. A compact umbrella also works as shade, which matters more than the rain in the hot season.", "umbrellaNo": "Probably not \u2014 little or no rain is expected. A hat, water and sun protection are the more useful things to carry.", "observedLabel": "Observed", "placeLabel": "Location", "forecastTitle": "Next 7 days", "forecastDays": "Daily high / low with rain probability", "todayLabel": "Today", "forecastNote": "Values are modelled for the temple's coordinates inside the old city. In the rainy season, showers usually arrive in the late afternoon and pass within an hour.", "unavailable": "Live conditions are temporarily unavailable \u2014 the seasonal table below gives a reliable year-round overview.", "codes": { "clear": "Clear sky", "mainlyClear": "Mainly clear", "partly": "Partly cloudy", "overcast": "Overcast", "fog": "Fog", "drizzle": "Drizzle", "rain": "Rain", "showers": "Rain showers", "snow": "Snow", "storm": "Thunderstorm" }, "uv": "UV", "humidityPlain": "Mugginess", "windPlain": "Wind", "levels": { "humidity": { "muggy": "Muggy", "humid": "Humid", "comfy": "Comfortable", "dry": "Dry" }, "humidityNote": { "muggy": "Sweat will not dry off", "humid": "Feels warmer than it reads", "comfy": "Comfortable on the skin", "dry": "Keep sipping water" }, "uv": { "low": "Low", "moderate": "Moderate", "high": "Strong", "veryHigh": "Very strong", "extreme": "Extreme" }, "wind": { "calm": "Light breeze", "breeze": "Breezy", "strong": "Windy", "gale": "Strong wind" } }, "advice": { "auto": "Generated from the current forecast \u2014 only the conditions that apply are shown. Check the latest forecast before you set off.", "none": "No weather risk to plan around right now", "blocks": { "alert": "Heads up", "dress": "What to wear", "plan": "How to plan the day", "gear": "What to carry", "best": "Best window" }, "alert": { "storm": "Thunderstorm about \u2014 avoid trees, open ground and high viewpoints", "heavyRain": "Heavy rain \u2014 keep away from low, flood-prone lanes and drainage canals", "heat": "Dangerously hot and humid around midday \u2014 cut outdoor time short", "wind": "Strong wind \u2014 stay clear of signboards, scaffolding and dead branches", "fog": "Poor visibility \u2014 slow down if you drive or ride a scooter" }, "dress": { "storm": "Quick-dry clothes and grippy shoes; skip long skirts and wide trousers", "heavyRain": "Waterproof jacket and non-slip shoes; a long umbrella is useless here", "rainLikely": "Quick-dry fabrics, and a compact umbrella in the bag", "lightRain": "Light rain \u2014 watch your footing on wet stone", "hot": "Hot day \u2014 loose, breathable cotton or linen works best", "heat": "Light-coloured, loose clothing so your body can shed heat", "uv": "Sun is strong \u2014 hat, sunglasses and sunscreen", "uvExtreme": "Extreme UV \u2014 a thin long-sleeve layer plus a hat beats sunscreen alone", "swing": "Big day-to-night swing \u2014 carry a light layer you can add or drop", "cold": "Cold day \u2014 a warm coat and a scarf earn their space", "wind": "Breezy \u2014 wear a hat that will not blow off", "wind7": "Strong wind \u2014 a windproof layer, and dress warm underneath", "ok": "Settled weather \u2014 everyday light clothing is fine; wear socks, shoes come off at the hall" }, "plan": { "storm": "Sit out the storm indoors; boat and high-level activities will likely close", "heavyRain": "Outdoor time will be grim \u2014 prioritise indoor stops and covered walkways", "rainLikely": "Rain is likely \u2014 put outdoor sightseeing in the morning; afternoon showers usually pass within the hour", "lightRain": "Drizzle will not ruin the old city; soft light is good for photos", "hot": "Skip being outside from 11:00 to 15:00 and rest indoors in between", "heat": "Walk early morning or late afternoon, and make midday an indoor stop", "muggy": "Humid and sticky \u2014 slow the pace and drink more water", "uv": "Walk on the shady side of the street and avoid standing in open squares", "wind": "Open-air activities may be affected \u2014 keep the schedule flexible", "wind7": "Outdoor activities will likely be cancelled \u2014 switch to indoor sightseeing", "sunny": "Clear and pleasant \u2014 good for slow outdoor wandering, best light early and late", "cloudy": "No harsh sun \u2014 comfortable for a long day outdoors", "fog": "Distant views will be flat \u2014 focus on close-up architecture and detail", "courtyard": "Shoes come off before entering the hall, and the courtyard stone bakes in the afternoon \u2014 do not stand barefoot", "ok": "Settled weather \u2014 a normal itinerary works; just keep drinking water" }, "best": { "morning": "Go out before 11:00 or after 16:00 to dodge both the midday heat and the afternoon showers", "wait": "Wait for the rain to ease before heading out \u2014 start with an indoor stop", "any": "Any time of day works \u2014 plan at your own pace" }, "gear": { "umbrella": "Compact umbrella", "foldingUmbrella": "Compact umbrella", "raincoat": "Rain jacket", "windBreaker": "Windbreaker", "shoesGrip": "Non-slip shoes", "hat": "Sun hat", "sunglasses": "Sunglasses", "sunscreen": "Sunscreen", "water": "Drinking water", "layer": "Light layer", "thickCoat": "Warm coat", "scarf": "Scarf", "slipOn": "Slip-on shoes", "socks": "Socks", "mask": "Face mask" }, "tips": { "storm": "Storms", "heavyRain": "Heavy rain", "umbrella": "Take an umbrella", "heat": "Heat", "sun": "Strong sun", "swing": "Big swing", "fog": "Low visibility", "comfy": "Comfortable" } } };
    seasons$1 = { "label": "When to go", "heading": "Seasonal visiting strategy", "intro": "Three seasons shape life in the old city, plus one annual air-quality window that matters more than the thermometer. This table combines temperature, rainfall, haze and visitor density so you can choose your weeks.", "climateNote": "Temperature and rainfall figures follow the WMO 1991\u20132020 standard normals for the Chiang Mai station; the hazy period reflects the agricultural burning season typical of February\u2013April across the northern provinces.", "columns": ["Season", "Months", "Temperature", "Rainfall", "Air & crowds", "What to plan for"], "rows": [{ "season": "Cool & dry", "months": "Nov \u2013 Feb", "temp": "14 \u2013 30 \xB0C", "rain": "Very low (under 30 mm/month)", "air": "Clear mornings, peak visitor season", "advice": "The best all-round window: warm days, cool evenings. Reserve accommodation early for December and January, and arrive before 09:00 for quiet photographs." }, { "season": "Hazy", "months": "Feb \u2013 Apr", "temp": "18 \u2013 38 \xB0C", "rain": "Very low", "air": "PM2.5 often elevated; afternoon haze", "advice": "Visit early in the morning or wait for the first rains in late April. Travellers with respiratory sensitivity should check the daily air-quality index before walking far." }, { "season": "Hot", "months": "Mar \u2013 May", "temp": "24 \u2013 40 \xB0C", "rain": "Low, with isolated storms", "air": "Strong light, fewer visitors", "advice": "Plan the temple before 10:00 or after 16:00. Carry water, use the shaded courtyards, and expect the stone terraces to be hot underfoot at midday." }, { "season": "Rainy", "months": "Jun \u2013 Oct", "temp": "23 \u2013 33 \xB0C", "rain": "Frequent afternoon downpours", "air": "Cleanest air of the year, quietest temple", "advice": "Mornings are usually dry and the courtyards are almost empty. Expect heavy but short showers after 15:00 \u2014 the wet stone and low clouds make this the most photogenic season." }], "tip": "Whatever the season, the temple grounds open early. The two hours after sunrise give you soft light, cool air and the fewest visitors." };
    routes$1 = { "label": "Plan by traveller", "heading": "Three routes for three kinds of visitors", "intro": "The compound is compact, so the difference between routes is pace and focus rather than distance. Choose the one that matches who you are travelling with.", "audiences": [{ "tag": "01", "title": "Families with children", "meta": "45 \u2013 60 min \xB7 pushchair friendly", "text": "Enter from Ratchapakhinai Road and make the elephant-backed chedi the first stop \u2014 children usually find the stone elephants before they notice the gold. Then rest in the shaded courtyard and finish at the ordination-hall terrace.", "stops": ["Elephant-backed chedi", "Shaded courtyard", "Ordination hall terrace"] }, { "tag": "02", "title": "Photography & architecture", "meta": "90 \u2013 120 min \xB7 best 07:00 \u2013 09:00", "text": "Work clockwise from the viharn: the naga staircase balustrades, the teak ordination hall, the elephant chedi in raking light, then the scripture library. Late afternoon adds warm light on the goldwork.", "stops": ["Naga staircase", "Teak ordination hall", "Elephant chedi", "Scripture library (ho trai)"] }, { "tag": "03", "title": "Low-effort & step-free", "meta": "30 \u2013 45 min \xB7 mostly level ground", "text": "The main approach from Ratchapakhinai Road is level. A single loop along the courtyard edge covers the chedi, the ordination hall exterior and the city pillar shrine without climbing steps; low kerbs remain in places.", "stops": ["Level main entrance", "Chedi viewing point", "Ordination hall exterior", "Bench seating"] }] };
    itinerary$1 = { "label": "Suggested routes", "heading": "Half-day and full-day plans", "intro": "Both plans start at Wat Chiang Man and stay inside the old city walls, so everything is reachable on foot or with one short ride.", "halfDay": { "title": "Half day (about 3 hours)", "summary": "The temple plus the two or three neighbouring monuments that give it context.", "steps": [{ "time": "08:00", "title": "Arrive at Wat Chiang Man", "text": "Cool air, soft light and the monks' morning routine. Start at the elephant-backed chedi." }, { "time": "09:00", "title": "Ordination hall & city pillar", "text": "Step inside the main hall, then see the city pillar shrine that ties the temple to the founding of the city." }, { "time": "10:00", "title": "Walk south to Wat Phra Singh", "text": "A 15-minute walk through the old city to Chiang Mai's other great temple complex." }, { "time": "11:00", "title": "Three Kings Monument", "text": "The square in front of the former provincial hall, where the founding alliance of the city is commemorated." }] }, "fullDay": { "title": "Full day (about 8 hours)", "summary": "The temple, the old city, a museum stop and an evening market.", "steps": [{ "time": "08:00", "title": "Wat Chiang Man", "text": "The oldest temple in the city, at its quietest in the early morning." }, { "time": "10:00", "title": "Old city loop on foot", "text": "Wat Chedi Luang and Wat Phra Singh, with a coffee stop on a side street." }, { "time": "12:30", "title": "Lunch near the moat", "text": "A wide choice of northern Thai restaurants within a few blocks of the moat." }, { "time": "14:00", "title": "Museum & city walls", "text": "Chiang Mai City Arts & Cultural Centre or a walk along the remaining brick ramparts and gates." }, { "time": "16:30", "title": "Return for late light", "text": "Come back to the temple when the tour groups have gone and the stone turns golden." }, { "time": "18:30", "title": "Evening market", "text": "One of the night markets inside or just outside the walls for dinner and local crafts." }] } };
    facilities$1 = { "label": "Visitor services", "heading": "Facilities in and around the temple", "intro": "A short, practical overview of what exists within a few minutes of the gate \u2014 described by type only, so you know what to look for rather than which shop to visit.", "neutralNote": "As an independent non-profit guide we do not recommend individual businesses. Categories, distances and the usual price level are given instead; opening hours and prices change often, so confirm locally.", "items": [{ "icon": "\u{1F6BB}", "title": "Restrooms", "type": "Public toilets \xB7 inside the compound", "text": "Public toilets are available inside the temple grounds near the entrance and car park. They are basic but maintained; carry your own tissues and hand sanitiser as a precaution." }, { "icon": "\u{1F17F}\uFE0F", "title": "Parking", "type": "Small on-site lot \xB7 free / donation", "text": "A compact parking area inside the compound serves cars and scooters. It fills up around midday in high season; roadside parking along Ratchapakhinai Road is the usual fallback." }, { "icon": "\u{1F35C}", "title": "Food & drink", "type": "Family restaurants, caf\xE9s, market stalls", "text": "Within a five-minute walk you will find small family-run restaurants, coffee stands and a morning market selling northern Thai dishes. Vegetarian options are common in the old city." }, { "icon": "\u{1F6CF}\uFE0F", "title": "Accommodation", "type": "Guesthouses \u2192 boutique hotels", "text": "The old city offers a full range, from budget guesthouses to small boutique hotels, mostly low-rise buildings in converted shophouses. Staying inside the moat puts the temple within walking distance." }, { "icon": "\u{1F3EA}", "title": "Groceries & convenience", "type": "Convenience stores, minimarkets, pharmacies", "text": "Convenience stores and small minimarkets line the main roads inside the moat, most open long hours. A traditional market near the moat sells fruit, drinking water and daily goods." }, { "icon": "\u26FD", "title": "Fuel & EV charging", "type": "Fuel stations, public charge points", "text": "Fuel stations sit on the moat ring road about five minutes away by car, and public AC/DC charge points for electric vehicles are available at shopping centres and larger hotels on the ring roads." }, { "icon": "\u{1F3E5}", "title": "Medical & pharmacy", "type": "Pharmacies \xB7 hospitals 10\u201315 min away", "text": "Pharmacies are frequent in the old city and can handle minor complaints. For anything serious, general and private hospitals are roughly ten to fifteen minutes by car; keep travel insurance details handy." }, { "icon": "\u{1F3E7}", "title": "Cash & banking", "type": "ATMs \xB7 exchange kiosks", "text": "ATMs and licensed exchange kiosks are found along the main streets inside the moat. Small temples and market stalls are cash-only, so keep some banknotes for donations and snacks." }], "walkingNote": "Distances from the temple gate: convenience store 2\u20134 min \xB7 restaurant 3\u20135 min \xB7 pharmacy 5\u20138 min \xB7 fuel station 5 min by car." };
    responsibility$1 = { "label": "Science & visitor responsibility", "heading": "How to visit respectfully", "intro": "Wat Chiang Man is a working monastery as well as a monument: roughly sixty monks and novices live and study here. Understanding what you are looking at makes the visit better, and a little care keeps it that way.", "groups": [{ "title": "Dress & entering", "points": ["Cover shoulders and knees; a light scarf solves most problems in seconds.", "Remove shoes before entering a hall, and never point the soles of your feet towards a Buddha image.", "Take off hats inside buildings and step over \u2014 never on \u2014 the raised threshold."] }, { "title": "Conduct & quiet", "points": ["Keep voices low; chanting and lessons take place most mornings and late afternoons.", "Do not touch murals, Buddha images or the carved woodwork \u2014 skin oils damage them permanently.", "Ask before photographing monks, and never photograph a person at prayer."] }, { "title": "Offerings & the environment", "points": ["Entry is free; donations are voluntary and go to the monastery's upkeep.", "Leave no litter, and prefer a refillable bottle \u2014 the old city has several refill points.", "Drones and tripods are not appropriate inside a monastery without written permission."] }], "pledge": "Take photographs, leave nothing behind, and let the people who worship here set the pace. That is the whole of temple etiquette.", "scienceNote": "Why it matters: lime plaster murals, teak structures and sandstone reliefs in northern Thailand survive in a hot, humid climate only because they are looked after daily. Humidity, flash photography and touching are the three things that age them fastest." };
    legends$1 = { "label": "Stories & chronicles", "heading": "Legends behind the temple", "intro": "Northern Thai history is recorded in palm-leaf chronicles known as tamnan, where fact, faith and royal propaganda sit side by side. These are the stories that attach to Wat Chiang Man.", "stories": [{ "tag": "Founding", "title": "The resting place of the white elephant", "text": "King Mangrai is said to have chosen this ground while searching for a new capital: a white elephant \u2014 the ultimate symbol of royal authority in the region \u2014 stopped here, trumpeted three times and refused to move. The king built his camp, 'Wiang Chiang Man', around it, and the later city of Chiang Mai grew outward from that camp." }, { "tag": "Sacred image", "title": "Phra Sae Tang Khamani, the crystal Buddha", "text": "A small image carved from clear crystal, it is said to have been brought from the Mon kingdom of Lavo (today's Lopburi) and carried north by Mangrai himself. Tradition credits it with protecting the city from storm and fire. It is normally kept in the raised scripture library and shown publicly during the Songkran festival in April." }, { "tag": "Rain ritual", "title": "Phra Sila and the promise of rain", "text": "A sandstone relief of the Buddha, Phra Sila is the temple's other great image. Because it is associated with rain-making, it is carried through the streets of the old city at Songkran so that townspeople can pour scented water over it and ask for a good growing season." }, { "tag": "Alliance", "title": "The pact of the three kings", "text": "Before founding Chiang Mai, Mangrai of Lanna, Ramkhamhaeng of Sukhothai and Ngam Mueang of Phayao are said to have sworn an alliance that secured the northern valleys. The Three Kings Monument, a short walk from the temple, commemorates it \u2014 and explains why this corner of the old city is treated as the city's birthplace." }, { "tag": "Symbolism", "title": "Nagas, elephants and guardian serpents", "text": "The staircases of the viharns are flanked by balustrades in the form of nagas, the serpent water spirits of Buddhist cosmology, while the great chedi rests on rows of sculpted elephants. Together they state the temple's purpose in stone: the Buddha's teaching upheld by the power of the earth." }], "note": "Chronicle traditions, not documented fact. Where the chronicles and archaeology disagree, the inscriptions and excavation reports are the better guide \u2014 but the stories are what local people have told for seven centuries." };
    hero$1 = { "titleMain": "Wat Chiang Man", "titleAccent": "Chiang Man", "eyebrow": "Chiang Mai Old City \xB7 Est. 1296", "subtitle": "The oldest temple in Chiang Mai, where King Mangrai first settled when he founded the city \u2014 a serene Lanna sanctuary of whitewashed walls, teak pillars and elephant-backed stupas.", "cta1": "Plan your visit", "cta2": "View on map", "rating": "4.7", "reviewCount": "6,192 Google reviews", "coordsLabel": "Old City, Chiang Mai", "viewLocation": "View location on Google Maps", "titleCity": "Chiang Mai", "heroAlt": "Wat Chiang Man - Main view in Chiang Mai, Thailand", "boardCategory": "At a glance", "boardTitle": "Wat Chiang Man", "boardEn": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \xB7 Chiang Mai, Thailand", "plannerTitle": "Golden-hour planner", "liveWeather": "Live weather", "plannerNote": "Golden-hour times shift with the seasons \u2014 a gentle guide, not a forecast.", "defaultTemp": "28\xB0C", "defaultCond": "Clear", "defaultWind": "5 km/h", "sunsetIndexLabel": "Light index", "sunsetIndexDefault": "Excellent", "goldenHourLabel": "Golden hour", "sunsetLabel": "Sunset", "blueHourLabel": "Blue hour", "defaultGolden": "18:10", "defaultSunset": "18:50", "defaultBlue": "19:10", "crowdWarningLabel": "Crowd note", "defaultTip": "Quietest before 08:00 and after 17:00; mornings have the best light for photography.", "lightCaption": "Light forecast uses local sun times (Asia/Bangkok).", "weatherError": "Weather unavailable", "goldenChanceLabel": "Golden-hour chance", "quickFacts": { "duration": "Plan for", "durationVal": "~45 minutes", "fee": "Entry fee", "feeVal": "Free (donations welcome)", "dress": "Dress code", "dressVal": "Cover shoulders & knees \xB7 remove shoes", "mustSee": "Top three", "mustSeeVal": "Elephant chedis \xB7 Crystal Buddha \xB7 Stone Buddha" } };
    about$1 = { "label": "About", "heading": "Chiang Mai\u2019s first temple", "headingEntity": "About Wat Chiang Man \u2014 Chiang Mai\u2019s First Temple", "entityLead": "Welcome to **Wat Chiang Man** (\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19), the temple that **watchiangman.com** is dedicated to. Located in the heart of **Chiang Mai**, **Chiang Mai** Province, **Thailand**, it is the oldest temple inside the old city walls and a primary landmark for travellers visiting the region.", "lead": "Tucked into the quiet north of the old walled city, Wat Chiang Man is where Chiang Mai began \u2014 both as a sacred site and as a royal residence.", "paragraph1": "In 1296 King Mangrai (Mengrai) chose this spot as his base while laying out the new Lanna capital. He built a modest pavilion here and lived in it during the city\u2019s founding \u2014 making Wat Chiang Man the oldest temple within Chiang Mai\u2019s moat.", "paragraph2": "Centuries later the temple remains a living place of worship. Its whitewashed walls, weathered teak and small scale give it an intimacy the larger city temples lack, even as it guards two of northern Thailand\u2019s most revered Buddha images.", "quote": "\u201CTo stand in Wat Chiang Man is to stand where Chiang Mai itself was born.\u201D", "quoteAuthor": "\u2014 Northern Thai chroniclers", "etymology": { "tag": "Name origin", "title": "What \u201CChiang Man\u201D means", "text": "In Lanna / Thai, \u201CChiang\u201D (\u0E40\u0E0A\u0E35\u0E22\u0E07) means \u201Ccity\u201D, and \u201CMan\u201D (\u0E21\u0E31\u0E48\u0E19) means \u201Cfirm, enduring\u201D. So \u201CChiang Man\u201D reads as \u201Cthe stable city\u201D \u2014 King Mangrai\u2019s wish that his new capital would endure." }, "stats": [{ "value": "1296", "label": "Founded by King Mangrai" }, { "value": "#1", "label": "Oldest temple in Chiang Mai" }, { "value": "05:00\u201319:00", "label": "Daily opening hours" }], "highlights": [{ "tag": "Crystal Buddha", "title": "Phra Sae Tang Khamani", "desc": "An 11th-century crystal Buddha believed to protect the city and bring rain." }, { "tag": "Stone Buddha", "title": "Phra Sila", "desc": "A revered stone image linked to Sri Lanka and the rainy season." }, { "tag": "Elephant chedis", "title": "Chiang Man stupas", "desc": "Two square stupas resting on the backs of ornate elephants." }], "editorTip": { "tag": "Editor\u2019s note", "text": "Dress modestly, remove your shoes in the halls, and aim for an early morning visit to enjoy the temple in peace.", "ctaLabel": "See visiting tips" } };
    arch$1 = { "label": "Architecture & Treasures", "heading": "Sacred art of the Lanna court", "intro": "Wat Chiang Man is a compact museum of Lanna craft \u2014 from its square elephant-backed stupas to the two small Buddhas that have drawn pilgrims for nearly a thousand years.", "treasuresTitle": "Two Buddhas, centuries of devotion", "treasures": [{ "tag": "Phra Sae Tang Khamani", "title": "The crystal Buddha", "text": "Carved from a single crystal and dated to the 11th century, this small standing Buddha is also called Phra Kaew Khao ('the white jewel'). It is paraded through the old city during Songkran to invite rain and fortune." }, { "tag": "Phra Sila", "title": "The stone Buddha", "text": "A sandstone relief image associated with Sri Lanka, long credited with rain-making powers. Devotees still venerate it for protection and a good harvest." }], "archTitle": "What to look for", "architecture": [{ "title": "Elephant-backed chedis", "desc": "Two cubical stupas (13th c.) sit on tiers of stucco elephants \u2014 the iconic 'Chiang Man' form unique to this temple, formally named Chedi Chang Lom (\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E25\u0E49\u0E2D\u0E21, 'stupa surrounded by elephants')." }, { "title": "Viharn Luang", "desc": "The main hall, rebuilt in the 1920s on the original foundations; its old teak pillars are preserved inside." }, { "title": "Ubosot (ordination hall)", "desc": "A smaller, quieter hall used for monastic rites, with fine Lanna woodwork." }], "noteTag": "Visiting tip", "noteText": "The two treasures are kept in the small library-style structure (ho trai) on the right; ask a monk if you\u2019d like a closer look." };
    history$1 = { "label": "History", "heading": "From royal camp to city shrine", "headingEntity": "History & Significance of Wat Chiang Man", "compareBefore": "Wat Chiang Man main viharn facade", "compareAfter": "Elephant-backed chedi at Wat Chiang Man", "compareHint": "Drag the slider left and right to compare architectural details", "intro": "Wat Chiang Man\u2019s story is the story of Chiang Mai\u2019s founding \u2014 a temple that began as a king\u2019s temporary dwelling and grew into the city\u2019s spiritual heart.", "blocks": [{ "date": "1296", "title": "Mangrai\u2019s encampment", "text": "King Mangrai of the Lanna kingdom chose the site as his headquarters while founding Chiang Mai, living in a pavilion that became the temple\u2019s nucleus." }, { "date": "13th\u201314th c.", "title": "The elephant chedis", "text": "The two square stupas on elephant backs were raised, establishing the distinctive Chiang Man architectural style." }, { "date": "1920s", "title": "Rebuilding the viharn", "text": "The main assembly hall was reconstructed on its original footprint, preserving the ancient teak columns within." }, { "date": "Today", "title": "A living temple", "text": "Wat Chiang Man remains an active monastery and the most visited of Chiang Mai\u2019s historic temples." }], "legend": { "title": "The rain-making Buddhas", "text": "Both Phra Sae Tang Khamani and Phra Sila are believed to control the rains. In times of drought, the crystal Buddha was once carried in procession to summon the monsoon." }, "didYouKnow": { "title": "Did you know?", "text": "Wat Chiang Man sits inside the square moat of the old city\u2019s northwest quarter \u2014 the exact area where Mangrai first laid out his capital." }, "folklore": { "title": "The crystal that calls the rain", "tale": "Local lore says the white crystal Buddha 'speaks' through the weather: when it is taken out for Songkran, the skies open and the rice fields drink. Farmers still watch its procession as a blessing for the year ahead.", "shrineTitle": "Where to see it", "shrine": "The crystal Buddha rests in the ho trai (scripture library) on the temple\u2019s right side, brought out for public viewing during Songkran each April." } };
    guide$1 = { "label": "Visitor Guide", "heading": "Plan a calm, respectful visit", "lead": "Wat Chiang Man is free to enter and easy to reach on foot from anywhere in the old city. A little planning makes the experience far richer.", "hub": { "t1": "Getting there & tickets", "t2": "Photography & light", "t3": "Etiquette & dress", "t4": "Accessibility" }, "hours": { "tag": "Opening hours", "time": "05:00 \u2013 19:00", "items": [{ "label": "Best light", "value": "06:00 \u2013 08:00" }, { "label": "Quietest", "value": "Mornings & after 17:00" }, { "label": "Closed", "value": "Never (daily)" }] }, "fees": { "tag": "Entry & donations", "title": "What it costs", "items": [{ "title": "Temple entry", "desc": "Free. A small donation at the booth supports upkeep and the monks." }, { "title": "Dress code", "desc": "Shoulders and knees covered; remove shoes in all halls." }, { "title": "Photography", "desc": "Allowed in the grounds; avoid flash and never photograph monks without asking." }] }, "transport": { "tag": "Getting there", "title": "How to arrive", "items": [{ "title": "From the airport", "desc": "Chiang Mai International Airport (CNX) is ~5 km from the Old City. Specific steps:", "steps": ["Arrive at the domestic or international arrival hall.", "Book an official airport taxi near Exit 1 or use the Grab/Bolt app (approx. 150\u2013200 THB).", "Ask the driver to go to 'Wat Chiang Man' inside the Old City.", "The driver will drop you off right at the main entrance on Ratchapakhinai Road."] }, { "title": "On foot", "desc": "10\u201315 min walk from Tha Phae Gate or most old-city guesthouses." }, { "title": "Songthaew / red truck", "desc": "Hop a red songthaew and ask for 'Wat Chiang Man' near Ratchapakhinai Rd." }, { "title": "Tuk-tuk / Grab", "desc": "A short, inexpensive ride from anywhere in the city centre." }] }, "photography": { "title": "Photography guide", "intro": "The temple\u2019s pale walls and warm teak glow at the edges of the day.", "timesTitle": "Best light", "times": [{ "period": "Dawn", "desc": "Soft, even light and empty courtyards \u2014 ideal for the elephant chedis." }, { "period": "Late afternoon", "desc": "Low sun rakes the stucco elephants and gilded halls." }], "spotsTitle": "Where to shoot", "spots": [{ "name": "Elephant chedis", "view": "From the courtyard, looking up at the tiers of elephants.", "tip": "Get low for a dramatic angle on the stupa base." }, { "name": "Viharn doorway", "view": "Framed by the teak eaves.", "tip": "Wait for a monk or local to pass for scale." }], "settingsTitle": "Settings", "settings": [{ "style": "Wide / landscape", "camera": "f/8, ISO 200, 16\u201324mm", "phone": "0.5\xD7 / 1\xD7, tap to expose for the walls" }, { "style": "Detail / texture", "camera": "f/4, ISO 400, 50mm", "phone": "2\xD7, hold steady for the stucco" }], "tipsTitle": "Etiquette", "tips": ["Never stand on a chedi or climb the stupas.", "Step around, not over, prayer mats and offerings.", "Ask before photographing people at worship."] }, "bestTime": { "title": "Best time to visit", "intro": "Chiang Mai is warm year-round; the temple is most rewarding in the cool and dry season.", "seasons": [{ "tag": "Cool", "months": "Nov\u2013Feb", "name": "Best overall", "desc": "Pleasant mornings, clear light, and the lead-up to Songkran." }, { "tag": "Hot", "months": "Mar\u2013May", "name": "Quiet & bright", "desc": "Very hot midday \u2014 come at dawn; Songkran (Apr) brings the crystal Buddha procession." }, { "tag": "Wet", "months": "Jun\u2013Oct", "name": "Green & calm", "desc": "Afternoon showers, fewer crowds, lush temple gardens." }] }, "safety": { "title": "Staying safe & respectful", "items": [{ "title": "Dress modestly", "desc": "Cover shoulders and knees; a scarf or sarong helps." }, { "title": "Mind your belongings", "desc": "Old-city temples are safe, but keep valuables close in busy periods." }, { "title": "Watch the sun", "desc": "Carry water \u2014 midday heat can be intense from March to May." }] }, "accessibility": { "title": "Accessibility", "intro": "The temple grounds are flat and mostly step-free; the halls have a few thresholds.", "items": [{ "title": "Paths", "desc": "Paved, level walkways connect the gates, chedis and halls." }, { "title": "Wheelchairs", "desc": "The courtyard is navigable; hall interiors are tight \u2014 ask a monk for help if needed." }, { "title": "Watch on-site signs", "desc": "Core areas such as the Ubosot (ordination hall) may restrict entry or require shoe removal \u2014 follow posted signs and monk guidance." }] }, "faqTitle": "Good to know", "faqs": [{ "q": "Where is Wat Chiang Man located?", "a": "Wat Chiang Man is located at 171 Ratchapakhinai Rd, Old City, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand (18.7938, 98.9867), inside the old city moat." }, { "q": "Is Wat Chiang Man free to visit?", "a": "Yes. Wat Chiang Man is a public temple and is free to visit year-round; donations are welcome but never required." }, { "q": "How old is Wat Chiang Man?", "a": "It was founded in 1296 by King Mangrai, making it the oldest temple in Chiang Mai." }, { "q": "Is entry really free?", "a": "Yes. Donations are welcome but not required." }, { "q": "What are the opening hours of Wat Chiang Man?", "a": "The temple grounds are open daily from about 05:00 to 19:00; there is no closing day." }, { "q": "Can I see the crystal Buddha?", "a": "It is kept in the ho trai and shown publicly during Songkran (April); at other times, ask a monk." }, { "q": "How long should I spend?", "a": "30\u201360 minutes is enough to see the highlights at a relaxed pace." }], "nearby": { "title": "Nearby in the old city", "headingEntity": "Landmarks & Attractions Around Wat Chiang Man", "cluster": "When visiting **Wat Chiang Man**, visitors can easily explore surrounding historical landmarks and points of interest, including **Wat Phra Singh** and **Three Kings Monument**.", "items": [{ "name": "Three Kings Monument", "desc": "The city\u2019s symbolic founding square, 10 min walk south.", "url": "https://maps.google.com/?q=Three+Kings+Monument+Chiang+Mai" }, { "name": "Wat Phra Singh", "desc": "A grand Lanna temple 15 min west.", "url": "https://maps.google.com/?q=Wat+Phra+Singh+Chiang+Mai" }, { "name": "Sunday Walking Street", "desc": "Chiang Mai\u2019s famous night market, just south on Ratchadamnoen Rd.", "url": "https://maps.google.com/?q=Sunday+Walking+Street+Chiang+Mai" }], "cta": "Explore more on the map" } };
    food$1 = { "label": "Nearby Eats", "heading": "Eat like a local nearby", "lead": "The lanes around Wat Chiang Man are packed with old-city caf\xE9s, noodle stalls and northern-Thai kitchens.", "dishes": [{ "tag": "Noodles", "name": "Khao Soi", "price": "\u0E3F50\u201370", "desc": "Chiang Mai\u2019s famous curried noodle soup \u2014 try it at a shop on Ratchaphakhinai." }, { "tag": "Sausage", "name": "Sai Ua", "price": "\u0E3F60", "desc": "Herbed northern-Thai pork sausage, grilled and served with chili." }, { "tag": "Snack", "name": "Kanom Krok", "price": "\u0E3F30", "desc": "Coconut-rice pancakes cooked on a hot griddle, crispy outside, soft within." }, { "tag": "Coffee", "name": "Old-city caf\xE9", "price": "\u0E3F50\u201390", "desc": "Quiet courtyard caf\xE9s for a slow breakfast before the temple." }], "quote": { "text": "\u201CThe best khao soi in the old city is a five-minute walk from the temple gate.\u201D", "author": "\u2014 A Chiang Mai regular" } };
    gallery$1 = { "label": "Gallery", "heading": "Inside Wat Chiang Man", "intro": "A visual walk through the temple\u2019s halls, chedis and quiet corners.", "credits": "Photos are illustrative of Wat Chiang Man\u2019s architecture and setting.", "alts": ["Wat Chiang Man temple grounds", "Whitewashed viharn walls", "Teak pillars of the main hall", "The elephant-backed chedi", "Stucco elephant detail", "Gilded Buddha image", "Main hall facade", "Temple courtyard", "Lanna roof eaves", "Prayer area inside the hall", "The stone Buddha Phra Sila", "The crystal Buddha shrine", "Pagoda against blue sky", "Monks\u2019 quarters", "Temple garden", "Naga staircase rail", "Ornate gable carving", "Bell tower", "Evening light on the walls", "Devotees lighting incense", "Old city moat nearby", "Lantern detail", "Quiet corner of the temple"], "viewLocation": "View location on Google Maps" };
    reviews$1 = { "label": "Reviews", "heading": "What visitors say", "intro": "Wat Chiang Man earns consistently high marks for its calm atmosphere and historic beauty.", "disclaimer": "Ratings summarise public visitor feedback and are provided for guidance only.", "declaration": "This site is an independent visitor guide and is not affiliated with the temple or Google.", "sourceNote": "Reviews synced from Google Maps user reviews, synced September 2026; copyright belongs to the original authors and Google Maps.", "sourceNotesLabel": "Reviews \xB7 synced September 2026", "viewAllCta": "See all reviews on Google Maps", "featured": [{ "text": "\u201CThe oldest and one of the most peaceful temples in the old city \u2014 the elephant chedis are unforgettable.\u201D", "source": "Google review" }, { "text": "\u201CCome early. We had the courtyard to ourselves and the light on the white walls was perfect.\u201D", "source": "Google review" }], "items": [{ "text": "Small but full of history. The crystal Buddha is mesmerising.", "rating": "5", "name": "Anya R.", "date": "March 2026" }, { "text": "Loved the elephant stupas \u2014 unlike anything else in Chiang Mai.", "rating": "5", "name": "Tom B.", "date": "February 2026" }, { "text": "Quiet and well kept. A lovely start to the morning.", "rating": "4", "name": "Lin W.", "date": "January 2026" }], "viewLocation": "View location on Google Maps" };
    sources$1 = { "label": "Sources & Attribution", "heading": "Where this info comes from", "intro": "Key facts are drawn from public references; photos are illustrative of the temple.", "photoTitle": "Image credits", "reviewTitle": "Reviews", "reviewNote": "Reviews \xB7 synced September 2026 \u2014 synced from Google Maps user reviews; copyright belongs to the original authors and Google Maps. Reviews are shown on this page only and are not included in our structured data.", "reviewLinkLabel": "See all reviews on Google Maps", "weatherTitle": "Weather & climate data", "weatherText": "Live conditions and the 7-day forecast are produced for the temple's coordinates by the Open-Meteo forecast service; seasonal normals use the WMO 1991\u20132020 reference period for the Chiang Mai station. Figures are travel guidance, not an official warning service \u2014 follow local advisories in severe weather.", "govTitle": "Official tourism portal", "govText": "For official updates and regional tourism information, visit the Thailand / Chiang Mai Official Tourism Portal.", "govLinkLabel": "Official Tourism Portal", "photoItems": [{ "text": "Gallery images are illustrative of Wat Chiang Man\u2019s architecture and setting.", "linkLabel": "Reference", "url": "https://en.wikipedia.org/wiki/Wat_Chiang_Man" }], "factTitle": "Facts & verification", "factText": "Founding date, the crystal and stone Buddhas, and the elephant chedis follow widely published accounts of Wat Chiang Man.", "correctionTitle": "Spot an error?", "correctionText": "If any detail looks wrong, we\u2019d love to fix it.", "correctionMailto": "mailto:n20186005@gmail.com", "correctionCta": "Email a correction", "copyright": "\xA9 2026 Wat Chiang Man Guide. Independent visitor resource." };
    mapSection$1 = { "label": "Map & Location", "heading": "Find Wat Chiang Man", "headingEntity": "Location & How to Visit Wat Chiang Man in Chiang Mai", "lead": "In the quiet north of the old city, on Ratchapakhinai Road, a short walk from the moat.", "stats": [{ "tag": "Rating", "value": "4.7", "sub": "6,192 reviews" }, { "tag": "Open", "value": "05:00\u201319:00", "sub": "Daily" }, { "tag": "Founded", "value": "1296", "sub": "King Mangrai" }], "address": "171 Ratchapakhinai Rd, Old City, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand", "plusCode": "QXVQ+GP", "coords": "18.7938, 98.9867" };
    footer$1 = { "brand": { "name": "Wat Chiang Man", "tagline": "Chiang Mai\u2019s oldest temple \xB7 Est. 1296" }, "about": "An independent visitor guide to Wat Chiang Man (\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19) \u2014 Chiang Mai\u2019s first temple, founded by King Mangrai in 1296.", "navTitle": "Explore", "navItems": [{ "label": "About", "href": "#about" }, { "label": "Architecture", "href": "#arch" }, { "label": "History", "href": "#history" }, { "label": "Visitor Guide", "href": "#guide" }, { "label": "Gallery", "href": "#gallery" }, { "label": "Reviews", "href": "#reviews" }, { "label": "Map", "href": "#map" }], "noteTitle": "Good to know", "note": "Free entry, daily 05:00\u201319:00. Dress modestly and remove shoes in the halls.", "mapsLabel": "Google Maps \u2192", "sourcesTitle": "Sources", "sourcesNote": "Facts from public references; photos illustrative.", "privacy": "Privacy", "verified": { "label": "Content verified", "text": "Verified March 2026 \xB7 Fact-check: Northern Thai Historical Archive" }, "terms": "Terms", "cookies": "Cookies", "disclaimerLead": "Independent guide", "unofficial": "This site is not affiliated with or endorsed by Wat Chiang Man or Google.", "dataSource": "Maps & place data: Google Maps.", "copyright": "\xA9 2026 Wat Chiang Man Guide. All rights reserved." };
    legal$1 = { "privacy": { "title": "Privacy Policy", "updated": "Last updated: 2026", "sections": [{ "h": "Information we collect", "p": "We do not collect personal data unless you contact us. Anonymous, aggregated usage stats may be used to improve the site." }, { "h": "Cookies", "p": "Essential cookies remember your language and consent preferences. No advertising or tracking cookies are set without your consent." }, { "h": "Your rights", "p": "You may request deletion of any information you have shared with us." }] }, "terms": { "title": "Terms of Service", "updated": "Last updated: 2026", "sections": [{ "h": "Use of this site", "p": "This is an independent guide provided for general information. Verify details such as opening hours before you travel." }, { "h": "No affiliation", "p": "We are not affiliated with Wat Chiang Man or any referenced service." }, { "h": "Liability", "p": "Use the information at your own risk; we are not liable for any loss arising from its use." }] }, "cookies": { "title": "Cookie Settings", "updated": "Last updated: 2026", "intro": "Manage how this site uses cookies.", "categories": [{ "h": "Essential", "status": "Always on", "p": "Required for the site to function and to remember your language.", "sub": "", "subStatus": "" }, { "h": "Preferences", "status": "On by default", "p": "Remembers your cookie consent choice.", "sub": "", "subStatus": "" }, { "h": "Analytics", "status": "Off by default", "p": "Anonymous, aggregated stats to improve the guide.", "sub": "", "subStatus": "" }], "consent": "Save preferences" } };
    en = {
      meta: meta$1,
      sync: sync$1,
      imageCopyright: imageCopyright$1,
      breadcrumb: breadcrumb$1,
      header: header$1,
      weather: weather$1,
      seasons: seasons$1,
      routes: routes$1,
      itinerary: itinerary$1,
      facilities: facilities$1,
      responsibility: responsibility$1,
      legends: legends$1,
      hero: hero$1,
      about: about$1,
      arch: arch$1,
      history: history$1,
      guide: guide$1,
      food: food$1,
      gallery: gallery$1,
      reviews: reviews$1,
      sources: sources$1,
      mapSection: mapSection$1,
      footer: footer$1,
      legal: legal$1
    };
    meta = { "title": "\u6E05\u66FC\u5BFA \u6E05\u8FC8\u6700\u53E4\u8001\u5BFA\u5E99\uFF08\u514D\u95E8\u7968 \xB7 \u5F00\u653E\u65F6\u95F4 \xB7 1296\uFF09", "description": "\u6E05\u66FC\u5BFA\uFF08Wat Chiang Man\uFF09\u662F\u6E05\u8FC8\u53E4\u57CE\u7B2C\u4E00\u5EA7\u5BFA\u5E99\uFF0C\u7531\u5B5F\u83B1\u738B\u4E8E 1296 \u5E74\u521B\u5EFA\u3002\u514D\u8D39\u5165\u5BFA\u3001\u6BCF\u65E5 05:00-19:00 \u5F00\u653E\uFF0C\u9644\u7740\u88C5\u8981\u6C42\u3001\u4EA4\u901A\u8DEF\u7EBF\u4E0E\u4E09\u5927\u5FC5\u770B\uFF1A\u5927\u8C61\u4F5B\u5854\u3001\u6C34\u6676\u4F5B\u3001\u77F3\u4F5B\u3002", "ogTitle": "\u6E05\u66FC\u5BFA - \u6E05\u8FC8\u6700\u53E4\u8001\u5BFA\u5E99\uFF081296 \u5E74 \xB7 \u514D\u8D39\u5F00\u653E\uFF09", "ogDescription": "\u6E05\u66FC\u5BFA\u6E38\u89C8\u6307\u5357\uFF1A\u514D\u8D39\u5165\u5BFA\u3001\u6BCF\u65E5 05:00-19:00 \u5F00\u653E\u3001\u7740\u88C5\u8981\u6C42\u3001\u5927\u8C61\u627F\u6258\u4F5B\u5854\u3001\u6C34\u6676\u4F5B\u4E0E\u77F3\u4F5B\uFF0C\u4EE5\u53CA\u4ECE\u5854\u4F69\u95E8\u6B65\u884C\u524D\u5F80\u7684\u8DEF\u7EBF\u3002" };
    sync = { "time": "2026 \u5E74 9 \u6708", "reviewsFrom": "\u8BC4\u4EF7\u6765\u81EA\u8C37\u6B4C\u5730\u56FE\u7528\u6237\u8BC4\u4EF7", "viewAll": "\u70B9\u51FB\u67E5\u770B\u8C37\u6B4C\u5730\u56FE\u5168\u90E8\u8BC4\u4EF7", "ratingNote": "\u8BC4\u5206\u4E0E\u8BC4\u4EF7\u6570\u540C\u6B65\u81EA\u8C37\u6B4C\u5730\u56FE\uFF08Google Maps\uFF09\u7528\u6237\u8BC4\u4EF7", "reviewsNote": "\u540C\u6B65\u81EA Google \u5730\u56FE\u7528\u6237\u8BC4\u4EF7\uFF0C\u540C\u6B65\u65F6\u95F4 2026 \u5E74 9 \u6708\uFF1B\u7248\u6743\u5F52\u539F\u4F5C\u8005\u4E0E Google \u5730\u56FE\u6240\u6709", "reviewsCta": "\u5728\u8C37\u6B4C\u5730\u56FE\u67E5\u770B\u5168\u90E8\u8BC4\u4EF7" };
    imageCopyright = "\u672C\u7F51\u7AD9\u6240\u5C55\u793A\u7684\u6240\u6709\u56FE\u7247\u4EA7\u6743\u53CA\u7248\u6743\u5747\u5F52\u539F\u6444\u5F71\u8005\u6240\u6709\u3002";
    breadcrumb = { "label": "\u9762\u5305\u5C51\u5BFC\u822A", "items": [{ "name": "\u6E05\u66FC\u5BFA" }, { "name": "\u6E05\u8FC8" }, { "name": "\u6E05\u8FC8\u5E9C" }, { "name": "\u6CF0\u56FD" }] };
    header = { "home": "\u9996\u9875", "about": "\u5173\u4E8E", "arch": "\u5EFA\u7B51\u4E0E\u5723\u7269", "legends": "\u4F20\u8BF4\u6545\u4E8B", "history": "\u5386\u53F2", "weather": "\u5929\u6C14", "seasons": "\u5B63\u8282", "guide": "\u6E38\u89C8\u6307\u5357", "routes": "\u5206\u4EBA\u7FA4\u8DEF\u7EBF", "itinerary": "\u63A8\u8350\u884C\u7A0B", "food": "\u5468\u8FB9\u7F8E\u98DF", "gallery": "\u56FE\u96C6", "facilities": "\u5468\u8FB9\u8BBE\u65BD", "responsibility": "\u79D1\u666E\u4E0E\u8D23\u4EFB", "reviews": "\u8BC4\u4EF7", "map": "\u5730\u56FE" };
    weather = { "label": "\u51FA\u884C\u53C2\u8003", "heading": "\u6E05\u8FC8\u5F53\u524D\u5929\u6C14", "intro": "\u53E4\u57CE\u5C5E\u70ED\u5E26\u8349\u539F\u6C14\u5019\uFF1A\u767D\u5929\u708E\u70ED\uFF0C\u96E8\u5B63\u5206\u660E\uFF0C\u51AC\u672B\u8FD8\u6709\u4E00\u6BB5\u96FE\u973E\u671F\u3002\u51FA\u53D1\u524D\u5148\u770B\u4E00\u773C\u4ECA\u5929\u7684\u5B9E\u51B5\u3002", "nowLabel": "\u5F53\u524D\u5B9E\u51B5", "feelsLike": "\u4F53\u611F\u6E29\u5EA6", "humidity": "\u76F8\u5BF9\u6E7F\u5EA6", "wind": "\u98CE\u901F", "windUnit": "km/h", "rainChance": "\u4ECA\u65E5\u964D\u6C34\u6982\u7387", "umbrellaTitle": "\u51FA\u95E8\u8981\u4E0D\u8981\u5E26\u4F1E\uFF1F", "umbrellaYes": "\u5EFA\u8BAE\u5E26 \u2014\u2014 \u4ECA\u5929\u6709\u964D\u96E8\u53EF\u80FD\u3002\u6298\u53E0\u4F1E\u540C\u65F6\u8FD8\u80FD\u906E\u9633\uFF0C\u5728\u70ED\u5B63\u906E\u9633\u5F80\u5F80\u6BD4\u6321\u96E8\u66F4\u91CD\u8981\u3002", "umbrellaNo": "\u57FA\u672C\u4E0D\u7528 \u2014\u2014 \u9884\u8BA1\u65E0\u660E\u663E\u964D\u96E8\u3002\u5E3D\u5B50\u3001\u996E\u6C34\u548C\u9632\u6652\u624D\u662F\u66F4\u8BE5\u5E26\u4E0A\u7684\u4E1C\u897F\u3002", "observedLabel": "\u89C2\u6D4B\u65F6\u95F4", "placeLabel": "\u4F4D\u7F6E", "forecastTitle": "\u672A\u6765 7 \u5929", "forecastDays": "\u6BCF\u65E5\u6700\u9AD8\uFF0F\u6700\u4F4E\u6E29\u4E0E\u964D\u6C34\u6982\u7387", "todayLabel": "\u4ECA\u5929", "forecastNote": "\u6570\u503C\u6309\u6E05\u66FC\u5BFA\u5750\u6807\u70B9\u8BA1\u7B97\u3002\u96E8\u5B63\u7684\u964D\u96E8\u591A\u51FA\u73B0\u5728\u5348\u540E\uFF0C\u901A\u5E38\u4E00\u5C0F\u65F6\u5185\u7ED3\u675F\u3002", "unavailable": "\u5B9E\u65F6\u5929\u6C14\u6682\u65F6\u65E0\u6CD5\u83B7\u53D6\uFF0C\u53EF\u53C2\u8003\u4E0B\u65B9\u5168\u5E74\u5B63\u8282\u7B56\u7565\u8868\u3002", "codes": { "clear": "\u6674", "mainlyClear": "\u6674\u95F4\u5C11\u4E91", "partly": "\u5C40\u90E8\u591A\u4E91", "overcast": "\u9634", "fog": "\u96FE", "drizzle": "\u6BDB\u6BDB\u96E8", "rain": "\u96E8", "showers": "\u9635\u96E8", "snow": "\u96EA", "storm": "\u96F7\u9635\u96E8" }, "uv": "\u7D2B\u5916\u7EBF", "humidityPlain": "\u6F6E\u6E7F\u7A0B\u5EA6", "windPlain": "\u98CE\u529B", "levels": { "humidity": { "muggy": "\u95F7\u70ED", "humid": "\u504F\u6F6E\u6E7F", "comfy": "\u8212\u9002", "dry": "\u504F\u5E72\u71E5" }, "humidityNote": { "muggy": "\u51FA\u6C57\u4E0D\u5BB9\u6613\u5E72", "humid": "\u4F53\u611F\u6BD4\u5B9E\u9645\u6E29\u5EA6\u9AD8", "comfy": "\u4F53\u611F\u521A\u597D", "dry": "\u8BB0\u5F97\u591A\u559D\u6C34" }, "uv": { "low": "\u5F31", "moderate": "\u4E2D\u7B49", "high": "\u504F\u5F3A", "veryHigh": "\u5F3A", "extreme": "\u6781\u5F3A" }, "wind": { "calm": "\u5FAE\u98CE", "breeze": "\u6709\u98CE", "strong": "\u98CE\u529B\u504F\u5927", "gale": "\u5927\u98CE" } }, "advice": { "auto": "\u4EE5\u4E0A\u5EFA\u8BAE\u7531\u5F53\u524D\u9884\u62A5\u81EA\u52A8\u751F\u6210\uFF0C\u53EA\u663E\u793A\u7B26\u5408\u6761\u4EF6\u7684\u6761\u76EE\uFF1B\u51FA\u53D1\u524D\u8BF7\u518D\u770B\u4E00\u773C\u6700\u65B0\u5929\u6C14\u3002", "none": "\u5F53\u524D\u6CA1\u6709\u9700\u8981\u7279\u522B\u9632\u8303\u7684\u5929\u6C14\u98CE\u9669", "blocks": { "alert": "\u98CE\u9669\u63D0\u9192", "dress": "\u51FA\u884C\u7A7F\u642D", "plan": "\u6E38\u73A9\u5B89\u6392", "gear": "\u968F\u8EAB\u7269\u54C1", "best": "\u5EFA\u8BAE\u65F6\u6BB5" }, "alert": { "storm": "\u6709\u96F7\u96E8\uFF0C\u4E0D\u8981\u5728\u6811\u4E0B\u3001\u7A7A\u65F7\u573A\u5730\u548C\u9AD8\u5904\u505C\u7559", "heavyRain": "\u964D\u96E8\u8F83\u5F3A\uFF0C\u907F\u5F00\u4F4E\u6D3C\u79EF\u6C34\u8DEF\u6BB5\u548C\u6CB3\u6C9F\u5730\u5E26", "heat": "\u9AD8\u6E29\u95F7\u70ED\uFF0C\u4E2D\u5348\u524D\u540E\u5BB9\u6613\u4E2D\u6691\uFF0C\u7F29\u77ED\u6237\u5916\u505C\u7559", "wind": "\u98CE\u529B\u8F83\u5927\uFF0C\u8FDC\u79BB\u5E7F\u544A\u724C\u3001\u4E34\u65F6\u642D\u5EFA\u7269\u548C\u67AF\u679D", "fog": "\u80FD\u89C1\u5EA6\u8F83\u5DEE\uFF0C\u81EA\u9A7E\u4E0E\u9A91\u8F66\u8BF7\u51CF\u901F\u6162\u884C" }, "dress": { "storm": "\u7A7F\u5FEB\u5E72\u8863\u7269\u548C\u9632\u6ED1\u978B\uFF0C\u4E0D\u8981\u7A7F\u957F\u88D9\u3001\u9614\u817F\u88E4", "heavyRain": "\u9632\u6C34\u5916\u5957\u914D\u9632\u6ED1\u978B\uFF0C\u957F\u67C4\u4F1E\u4E0D\u5B9E\u7528", "rainLikely": "\u8863\u7269\u9009\u901F\u5E72\u9762\u6599\uFF0C\u5305\u91CC\u653E\u4E00\u628A\u6298\u53E0\u4F1E", "lightRain": "\u6709\u5C0F\u96E8\uFF0C\u8D70\u8DEF\u6CE8\u610F\u811A\u4E0B\u9632\u6ED1", "hot": "\u6C14\u6E29\u504F\u9AD8\uFF0C\u8F7B\u8584\u900F\u6C14\u7684\u68C9\u9EBB\u8863\u7269\u6700\u8212\u670D", "heat": "\u7A7F\u6D45\u8272\u5BBD\u677E\u8863\u7269\uFF0C\u65B9\u4FBF\u6563\u70ED", "uv": "\u7D2B\u5916\u7EBF\u504F\u5F3A\uFF0C\u5E3D\u5B50\u3001\u58A8\u955C\u548C\u9632\u6652\u971C\u90FD\u7528\u4E0A", "uvExtreme": "\u7D2B\u5916\u7EBF\u5F88\u5F3A\uFF0C\u8584\u957F\u8896\u52A0\u5E3D\u5B50\u6BD4\u9632\u6652\u971C\u66F4\u7BA1\u7528", "swing": "\u663C\u591C\u6E29\u5DEE\u5927\uFF0C\u5305\u91CC\u5907\u4E00\u4EF6\u8584\u5916\u5957\u65B9\u4FBF\u589E\u51CF", "cold": "\u6C14\u6E29\u504F\u4F4E\uFF0C\u539A\u5916\u5957\u548C\u56F4\u5DFE\u7528\u5F97\u4E0A", "wind": "\u98CE\u504F\u5927\uFF0C\u6234\u4E0D\u5BB9\u6613\u88AB\u5439\u8D70\u7684\u5E3D\u5B50", "wind7": "\u5927\u98CE\u5929\uFF0C\u7A7F\u9632\u98CE\u5916\u5957\u5E76\u6CE8\u610F\u4FDD\u6696", "ok": "\u5929\u6C14\u5E73\u7A33\uFF0C\u65E5\u5E38\u8F7B\u8584\u8863\u7269\u5373\u53EF\uFF0C\u8FDB\u6BBF\u8131\u978B\u65F6\u8BB0\u5F97\u7A7F\u889C\u5B50" }, "plan": { "storm": "\u5148\u8EB2\u8FDB\u5BA4\u5185\u7B49\u96F7\u96E8\u8FC7\u53BB\uFF1B\u6C34\u4E0A\u548C\u9AD8\u7A7A\u9879\u76EE\u5927\u6982\u7387\u5173\u95ED", "heavyRain": "\u6237\u5916\u4F53\u9A8C\u8F83\u5DEE\uFF0C\u4F18\u5148\u5B89\u6392\u5BA4\u5185\u548C\u6709\u9876\u8D70\u5ECA\u7684\u884C\u7A0B", "rainLikely": "\u6709\u964D\u96E8\u53EF\u80FD\uFF0C\u628A\u6237\u5916\u884C\u7A0B\u6392\u5728\u4E0A\u5348\uFF0C\u5348\u540E\u9635\u96E8\u591A\u534A\u4E00\u5C0F\u65F6\u5185\u7ED3\u675F", "lightRain": "\u5C0F\u96E8\u4E0D\u803D\u8BEF\u901B\u53E4\u57CE\uFF0C\u5149\u7EBF\u67D4\u548C\u53CD\u800C\u9002\u5408\u62CD\u7167", "hot": "\u907F\u5F00 11:00\u201315:00 \u7684\u66B4\u6652\u65F6\u6BB5\uFF0C\u4E2D\u95F4\u5B89\u6392\u5BA4\u5185\u4F11\u606F", "heat": "\u6B65\u884C\u5B89\u6392\u5728\u6E05\u6668\u6216\u508D\u665A\uFF0C\u6B63\u5348\u6539\u6210\u5BA4\u5185\u53C2\u89C2", "muggy": "\u6E7F\u5EA6\u5927\u3001\u51FA\u6C57\u4E0D\u5BB9\u6613\u5E72\uFF0C\u653E\u6162\u8282\u594F\u5E76\u591A\u8865\u6C34", "uv": "\u5C3D\u91CF\u8D70\u6709\u6811\u836B\u7684\u4E00\u4FA7\uFF0C\u4E0D\u8981\u5728\u7A7A\u65F7\u5E7F\u573A\u4E45\u7AD9", "wind": "\u9732\u5929\u9879\u76EE\u53EF\u80FD\u53D7\u5F71\u54CD\uFF0C\u884C\u7A0B\u7559\u70B9\u5F39\u6027", "wind7": "\u6237\u5916\u9879\u76EE\u5927\u6982\u7387\u5173\u95ED\uFF0C\u6539\u5BA4\u5185\u6E38\u89C8\u66F4\u7A33\u59A5", "sunny": "\u5929\u6C14\u6674\u597D\uFF0C\u9002\u5408\u6237\u5916\u6162\u6162\u901B\uFF0C\u65E9\u665A\u5149\u7EBF\u6700\u9002\u5408\u62CD\u7167", "cloudy": "\u6CA1\u6709\u66B4\u6652\uFF0C\u9002\u5408\u957F\u65F6\u95F4\u6237\u5916\u6E38\u89C8", "fog": "\u8FDC\u666F\u62CD\u4E0D\u6E05\uFF0C\u66F4\u9002\u5408\u62CD\u8FD1\u5904\u7684\u5EFA\u7B51\u7EC6\u8282", "courtyard": "\u8FDB\u6BBF\u9700\u8131\u978B\uFF0C\u5348\u540E\u5EAD\u9662\u77F3\u6750\u88AB\u6652\u5F97\u53D1\u70EB\uFF0C\u522B\u8D64\u811A\u4E45\u7AD9", "ok": "\u5929\u6C14\u5E73\u7A33\uFF0C\u6309\u5E38\u89C4\u884C\u7A0B\u6E38\u89C8\u5373\u53EF\uFF0C\u8BB0\u5F97\u968F\u65F6\u8865\u6C34" }, "best": { "morning": "\u5EFA\u8BAE 08:30\u201311:00 \u6216 16:00 \u4EE5\u540E\u51FA\u95E8\uFF0C\u6B63\u5348\u9AD8\u6E29\u548C\u5348\u540E\u9635\u96E8\u90FD\u80FD\u907F\u5F00", "wait": "\u7B49\u96E8\u52BF\u51CF\u5F31\u518D\u51FA\u95E8\uFF0C\u5148\u5B89\u6392\u5BA4\u5185\u6216\u5C31\u8FD1\u4F11\u606F", "any": "\u5168\u5929\u90FD\u9002\u5408\u53C2\u8BBF\uFF0C\u6309\u81EA\u5DF1\u7684\u8282\u594F\u5B89\u6392\u5373\u53EF" }, "gear": { "umbrella": "\u6298\u53E0\u4F1E", "foldingUmbrella": "\u6298\u53E0\u4F1E", "raincoat": "\u96E8\u8863", "windBreaker": "\u9632\u98CE\u5916\u5957", "shoesGrip": "\u9632\u6ED1\u978B", "hat": "\u906E\u9633\u5E3D", "sunglasses": "\u58A8\u955C", "sunscreen": "\u9632\u6652\u971C", "water": "\u996E\u7528\u6C34", "layer": "\u8584\u5916\u5957", "thickCoat": "\u539A\u5916\u5957", "scarf": "\u56F4\u5DFE", "slipOn": "\u6613\u7A7F\u8131\u7684\u978B", "socks": "\u889C\u5B50", "mask": "\u53E3\u7F69" }, "tips": { "storm": "\u96F7\u96E8", "heavyRain": "\u5927\u96E8", "umbrella": "\u5E26\u4F1E", "heat": "\u9632\u6691", "sun": "\u9632\u6652", "swing": "\u6E29\u5DEE\u5927", "fog": "\u80FD\u89C1\u5EA6\u4F4E", "comfy": "\u8212\u9002" } } };
    seasons = { "label": "\u6700\u4F73\u5B63\u8282", "heading": "\u5B63\u5EA6\u6E38\u89C8\u7B56\u7565", "intro": "\u6E05\u8FC8\u53E4\u57CE\u4E00\u5E74\u6709\u4E09\u4E2A\u660E\u663E\u5B63\u8282\uFF0C\u53E6\u6709\u4E00\u6BB5\u6BD4\u6C14\u6E29\u66F4\u503C\u5F97\u5173\u6CE8\u7684\u7A7A\u6C14\u7A97\u53E3\u3002\u4E0B\u8868\u7EFC\u5408\u6C14\u6E29\u3001\u964D\u96E8\u3001\u96FE\u973E\u4E0E\u5BA2\u6D41\uFF0C\u5E2E\u4F60\u6311\u5BF9\u51FA\u884C\u5468\u6B21\u3002", "climateNote": "\u6C14\u6E29\u4E0E\u964D\u96E8\u91C7\u7528\u4E16\u754C\u6C14\u8C61\u7EC4\u7EC7\uFF08WMO\uFF091991\u20132020 \u5E74\u6807\u51C6\u6C14\u5019\u6001\uFF08\u6E05\u8FC8\u7AD9\u5E38\u5E74\u503C\uFF09\uFF1B\u96FE\u973E\u671F\u4E3A\u6CF0\u5317\u5404\u7701 2\u20134 \u6708\u5178\u578B\u7684\u519C\u4E1A\u711A\u70E7\u5B63\u3002", "columns": ["\u5B63\u8282", "\u6708\u4EFD", "\u6C14\u6E29", "\u964D\u96E8", "\u7A7A\u6C14\u4E0E\u5BA2\u6D41", "\u884C\u7A0B\u5EFA\u8BAE"], "rows": [{ "season": "\u51C9\u5B63", "months": "11 \u6708 \u2013 2 \u6708", "temp": "14 \u2013 30 \xB0C", "rain": "\u6781\u5C11\uFF08\u6708\u5747\u4E0D\u8DB3 30 \u6BEB\u7C73\uFF09", "air": "\u6E05\u6668\u901A\u900F\uFF0C\u5BA2\u6D41\u6700\u9AD8", "advice": "\u7EFC\u5408\u6700\u4F18\u7A97\u53E3\uFF1A\u767D\u5929\u6E29\u6696\u3001\u591C\u665A\u51C9\u723D\u300212 \u6708\u4E0E 1 \u6708\u9700\u63D0\u524D\u8BA2\u623F\uFF1B\u60F3\u62CD\u5230\u5B89\u9759\u7684\u5BFA\u9662\uFF0C9 \u70B9\u524D\u5230\u8FBE\u3002" }, { "season": "\u96FE\u973E\u5B63", "months": "2 \u6708 \u2013 4 \u6708", "temp": "18 \u2013 38 \xB0C", "rain": "\u6781\u5C11", "air": "PM2.5 \u5E38\u504F\u9AD8\uFF0C\u5348\u540E\u6709\u973E", "advice": "\u5C3D\u91CF\u6E05\u6668\u524D\u5F80\uFF0C\u6216\u7B49 4 \u6708\u4E0B\u65EC\u7B2C\u4E00\u573A\u96E8\u540E\u3002\u547C\u5438\u9053\u654F\u611F\u4EBA\u7FA4\u8BF7\u5148\u770B\u5F53\u65E5\u7A7A\u6C14\u8D28\u91CF\u6307\u6570\u3002" }, { "season": "\u70ED\u5B63", "months": "3 \u6708 \u2013 5 \u6708", "temp": "24 \u2013 40 \xB0C", "rain": "\u504F\u5C11\uFF0C\u5076\u6709\u96F7\u66B4", "air": "\u5149\u7EBF\u5F3A\u70C8\uFF0C\u6E38\u5BA2\u8F83\u5C11", "advice": "\u628A\u5BFA\u9662\u5B89\u6392\u5728 10 \u70B9\u524D\u6216 16 \u70B9\u540E\u3002\u968F\u8EAB\u5E26\u6C34\uFF0C\u591A\u5229\u7528\u5EAD\u9662\u9634\u5F71\uFF1B\u6B63\u5348\u77F3\u53F0\u5730\u9762\u6E29\u5EA6\u5F88\u9AD8\u3002" }, { "season": "\u96E8\u5B63", "months": "6 \u6708 \u2013 10 \u6708", "temp": "23 \u2013 33 \xB0C", "rain": "\u5348\u540E\u5E38\u6709\u66B4\u96E8", "air": "\u5168\u5E74\u7A7A\u6C14\u6700\u5E72\u51C0\uFF0C\u5BFA\u9662\u6700\u5B89\u9759", "advice": "\u4E0A\u5348\u901A\u5E38\u65E0\u96E8\uFF0C\u5EAD\u9662\u51E0\u4E4E\u65E0\u4EBA\u300215 \u70B9\u540E\u53EF\u80FD\u6709\u77ED\u65F6\u5F3A\u964D\u96E8\u2014\u2014\u6E7F\u77F3\u4E0E\u4F4E\u4E91\u53CD\u800C\u662F\u6700\u597D\u770B\u7684\u5B63\u8282\u3002" }], "tip": "\u4E0D\u8BBA\u54EA\u4E2A\u5B63\u8282\uFF0C\u5BFA\u9662\u5EAD\u9662\u90FD\u5F00\u95E8\u5F88\u65E9\u3002\u65E5\u51FA\u540E\u4E24\u5C0F\u65F6\u5149\u7EBF\u6700\u67D4\u3001\u7A7A\u6C14\u6700\u51C9\uFF0C\u4EBA\u4E5F\u6700\u5C11\u3002" };
    routes = { "label": "\u6309\u4EBA\u7FA4\u89C4\u5212", "heading": "\u4E09\u6761\u8DEF\u7EBF\uFF0C\u5BF9\u5E94\u4E09\u79CD\u65C5\u4F34", "intro": "\u5BFA\u9662\u89C4\u6A21\u4E0D\u5927\uFF0C\u8DEF\u7EBF\u5DEE\u522B\u4E0D\u5728\u8DDD\u79BB\u800C\u5728\u8282\u594F\u4E0E\u91CD\u70B9\u3002\u6309\u540C\u884C\u4EBA\u9009\u4E00\u6761\u5373\u53EF\u3002", "audiences": [{ "tag": "01", "title": "\u4EB2\u5B50\u5BB6\u5EAD", "meta": "45 \u2013 60 \u5206\u949F \xB7 \u5A74\u513F\u8F66\u53EF\u901A\u884C", "text": "\u4ECE Ratchapakhinai \u8DEF\u8FDB\u5165\uFF0C\u7B2C\u4E00\u7AD9\u76F4\u63A5\u770B\u5927\u8C61\u4F5B\u5854\u2014\u2014\u5B69\u5B50\u603B\u662F\u5148\u6CE8\u610F\u5230\u77F3\u8C61\uFF0C\u800C\u4E0D\u662F\u91D1\u9876\u3002\u4E4B\u540E\u5728\u5EAD\u9662\u6811\u836B\u4E0B\u4F11\u606F\uFF0C\u6700\u540E\u5230\u5927\u6BBF\u5E73\u53F0\u6536\u5C3E\u3002", "stops": ["\u5927\u8C61\u627F\u6258\u4F5B\u5854", "\u5EAD\u9662\u6811\u836B", "\u5927\u6BBF\u5E73\u53F0"] }, { "tag": "02", "title": "\u6444\u5F71\u4E0E\u5EFA\u7B51", "meta": "90 \u2013 120 \u5206\u949F \xB7 \u5EFA\u8BAE 07:00 \u2013 09:00", "text": "\u4ECE\u4E3B\u6BBF\u5F00\u59CB\u987A\u65F6\u9488\u8D70\uFF1A\u90A3\u4F3D\uFF08\u86C7\u795E\uFF09\u6276\u624B\u697C\u68AF\u3001\u67DA\u6728\u6212\u5802\u3001\u4FA7\u5149\u4E0B\u7684\u5927\u8C61\u4F5B\u5854\uFF0C\u6700\u540E\u662F\u85CF\u7ECF\u9601\u3002\u508D\u665A\u56DE\u6765\u53EF\u62CD\u5230\u91D1\u9970\u4E0A\u7684\u6696\u5149\u3002", "stops": ["\u90A3\u4F3D\u697C\u68AF", "\u67DA\u6728\u6212\u5802", "\u5927\u8C61\u4F5B\u5854", "\u85CF\u7ECF\u9601\uFF08Ho Trai\uFF09"] }, { "tag": "03", "title": "\u4F4E\u4F53\u529B / \u65E0\u969C\u788D", "meta": "30 \u2013 45 \u5206\u949F \xB7 \u57FA\u672C\u5E73\u8DEF", "text": "\u7531 Ratchapakhinai \u8DEF\u7684\u4E3B\u5165\u53E3\u8FDB\u5165\u4E3A\u5E73\u8DEF\u3002\u6CBF\u5EAD\u9662\u8FB9\u7F18\u8D70\u4E00\u5708\uFF0C\u5373\u53EF\u4E0D\u5FC5\u767B\u9636\u770B\u5230\u4F5B\u5854\u3001\u6212\u5802\u5916\u89C2\u4E0E\u57CE\u67F1\u795E\u9F9B\uFF1B\u5C40\u90E8\u4ECD\u6709\u4F4E\u53F0\u9636\u3002", "stops": ["\u5E73\u8DEF\u4E3B\u5165\u53E3", "\u4F5B\u5854\u89C2\u666F\u70B9", "\u6212\u5802\u5916\u89C2", "\u4F11\u606F\u957F\u6905"] }] };
    itinerary = { "label": "\u63A8\u8350\u8DEF\u7EBF", "heading": "\u534A\u65E5\u4E0E\u5168\u65E5\u884C\u7A0B", "intro": "\u4E24\u6761\u8DEF\u7EBF\u90FD\u4EE5\u6E05\u66FC\u5BFA\u4E3A\u8D77\u70B9\uFF0C\u5168\u7A0B\u5728\u53E4\u57CE\u62A4\u57CE\u6CB3\u4EE5\u5185\uFF0C\u6B65\u884C\u6216\u4E00\u6B21\u77ED\u9014\u8F66\u7A0B\u5373\u53EF\u5B8C\u6210\u3002", "halfDay": { "title": "\u534A\u65E5\u6E38\uFF08\u7EA6 3 \u5C0F\u65F6\uFF09", "summary": "\u6E05\u66FC\u5BFA + \u4E24\u4E09\u4E2A\u80FD\u5E2E\u5B83\u5EFA\u7ACB\u80CC\u666F\u7684\u90BB\u5C45\u3002", "steps": [{ "time": "08:00", "title": "\u62B5\u8FBE\u6E05\u66FC\u5BFA", "text": "\u7A7A\u6C14\u51C9\u723D\u3001\u5149\u7EBF\u67D4\u548C\uFF0C\u8FD8\u80FD\u770B\u5230\u50E7\u4EBA\u7684\u65E9\u8BFE\u3002\u4ECE\u5927\u8C61\u4F5B\u5854\u5F00\u59CB\u3002" }, { "time": "09:00", "title": "\u6212\u5802\u4E0E\u57CE\u67F1", "text": "\u8FDB\u5165\u4E3B\u6BBF\u53C2\u89C2\uFF0C\u518D\u770B\u770B\u628A\u8FD9\u5EA7\u5BFA\u4E0E\u5EFA\u57CE\u53F2\u7ED1\u5728\u4E00\u8D77\u7684\u57CE\u67F1\u795E\u9F9B\u3002" }, { "time": "10:00", "title": "\u5357\u884C\u81F3\u5E15\u8F9B\u5BFA", "text": "\u6B65\u884C\u7EA6 15 \u5206\u949F\u7A7F\u8FC7\u53E4\u57CE\uFF0C\u5230\u6E05\u8FC8\u53E6\u4E00\u5EA7\u91CD\u8981\u5BFA\u9662\u5EFA\u7B51\u7FA4\u3002" }, { "time": "11:00", "title": "\u4E09\u738B\u7EAA\u5FF5\u7891", "text": "\u65E7\u7701\u653F\u5385\u524D\u7684\u5E7F\u573A\uFF0C\u7EAA\u5FF5\u5EFA\u57CE\u7684\u4E09\u738B\u76DF\u7EA6\u3002" }] }, "fullDay": { "title": "\u5168\u65E5\u6E38\uFF08\u7EA6 8 \u5C0F\u65F6\uFF09", "summary": "\u5BFA\u9662\u3001\u53E4\u57CE\u3001\u4E00\u5EA7\u535A\u7269\u9986\uFF0C\u4EE5\u53CA\u4E00\u4E2A\u591C\u5E02\u3002", "steps": [{ "time": "08:00", "title": "\u6E05\u66FC\u5BFA", "text": "\u57CE\u91CC\u6700\u53E4\u8001\u7684\u5BFA\u9662\uFF0C\u6E05\u6668\u6700\u5B89\u9759\u3002" }, { "time": "10:00", "title": "\u53E4\u57CE\u6B65\u884C\u73AF\u7EBF", "text": "\u5951\u8FEA\u9F99\u5BFA\u4E0E\u5E15\u8F9B\u5BFA\uFF0C\u4E2D\u9014\u5728\u5C0F\u5DF7\u5496\u5561\u9986\u6B47\u811A\u3002" }, { "time": "12:30", "title": "\u62A4\u57CE\u6CB3\u8FB9\u5348\u9910", "text": "\u62A4\u57CE\u6CB3\u51E0\u4E2A\u8857\u533A\u5185\u6709\u5927\u91CF\u6CF0\u5317\u83DC\u9910\u5385\u53EF\u9009\u3002" }, { "time": "14:00", "title": "\u535A\u7269\u9986\u4E0E\u57CE\u5899", "text": "\u6E05\u8FC8\u57CE\u5E02\u827A\u672F\u6587\u5316\u4E2D\u5FC3\uFF0C\u6216\u6CBF\u6B8B\u5B58\u7816\u780C\u57CE\u5899\u4E0E\u57CE\u95E8\u8D70\u4E00\u6BB5\u3002" }, { "time": "16:30", "title": "\u56DE\u5BFA\u770B\u5915\u7167", "text": "\u65C5\u884C\u56E2\u6563\u53BB\u540E\u56DE\u5230\u5BFA\u91CC\uFF0C\u77F3\u5934\u4F1A\u53D8\u6210\u91D1\u8272\u3002" }, { "time": "18:30", "title": "\u591C\u5E02", "text": "\u57CE\u5185\u6216\u57CE\u5916\u7684\u591C\u5E02\uFF0C\u89E3\u51B3\u665A\u9910\u5E76\u770B\u770B\u672C\u5730\u624B\u4F5C\u3002" }] } };
    facilities = { "label": "\u8BBF\u5BA2\u670D\u52A1", "heading": "\u5BFA\u5185\u4E0E\u5468\u8FB9\u8BBE\u65BD", "intro": "\u4EE5\u4E0B\u6309\u300C\u7C7B\u578B\u300D\u6982\u8FF0\u5BFA\u95E8\u51E0\u5206\u949F\u6B65\u884C\u8303\u56F4\u5185\u6709\u54EA\u4E9B\u670D\u52A1\u2014\u2014\u53EA\u8BF4\u660E\u8BE5\u627E\u4EC0\u4E48\uFF0C\u4E0D\u6307\u540D\u5177\u4F53\u5546\u6237\u3002", "neutralNote": "\u4F5C\u4E3A\u72EC\u7ACB\u975E\u8425\u5229\u79D1\u666E\u7AD9\u70B9\uFF0C\u6211\u4EEC\u4E0D\u505A\u5177\u4F53\u5546\u6237\u63A8\u8350\uFF0C\u53EA\u7ED9\u51FA\u8BBE\u65BD\u7C7B\u578B\u3001\u6B65\u884C\u8DDD\u79BB\u4E0E\u5E38\u89C1\u4EF7\u4F4D\u3002\u8425\u4E1A\u65F6\u95F4\u4E0E\u4EF7\u683C\u53D8\u52A8\u9891\u7E41\uFF0C\u8BF7\u4EE5\u73B0\u573A\u4E3A\u51C6\u3002", "items": [{ "icon": "\u{1F6BB}", "title": "\u6D17\u624B\u95F4", "type": "\u516C\u5171\u5395\u6240 \xB7 \u5BFA\u9662\u5185", "text": "\u5BFA\u9662\u9760\u8FD1\u5165\u53E3\u4E0E\u505C\u8F66\u573A\u7684\u533A\u57DF\u8BBE\u6709\u516C\u5171\u5395\u6240\uFF0C\u6761\u4EF6\u7B80\u5355\u4F46\u6709\u4EBA\u7EF4\u62A4\u3002\u5EFA\u8BAE\u81EA\u5907\u7EB8\u5DFE\u4E0E\u514D\u6D17\u6D17\u624B\u6DB2\u3002" }, { "icon": "\u{1F17F}\uFE0F", "title": "\u505C\u8F66", "type": "\u5C0F\u578B\u9662\u5185\u505C\u8F66\u573A \xB7 \u514D\u8D39 / \u968F\u559C", "text": "\u5BFA\u9662\u5185\u6709\u4E00\u5904\u5C0F\u578B\u505C\u8F66\u573A\uFF0C\u53EF\u505C\u6C7D\u8F66\u4E0E\u6469\u6258\u8F66\u3002\u65FA\u5B63\u4E2D\u5348\u524D\u540E\u5E38\u6EE1\u4F4D\uFF0C\u901A\u5E38\u53EF\u6539\u505C Ratchapakhinai \u8DEF\u4E24\u4FA7\u3002" }, { "icon": "\u{1F35C}", "title": "\u9910\u996E", "type": "\u5BB6\u5EAD\u9910\u9986 \xB7 \u5496\u5561\u644A \xB7 \u83DC\u5E02\u573A", "text": "\u6B65\u884C 5 \u5206\u949F\u5185\u6709\u4E0D\u5C11\u5BB6\u5EAD\u5F0F\u5C0F\u9986\u3001\u5496\u5561\u644A\u548C\u4E00\u4E2A\u65E9\u5E02\uFF0C\u4F9B\u5E94\u6CF0\u5317\u83DC\u3002\u53E4\u57CE\u5185\u7D20\u98DF\u9009\u62E9\u4E5F\u5F88\u591A\u3002" }, { "icon": "\u{1F6CF}\uFE0F", "title": "\u4F4F\u5BBF", "type": "\u7ECF\u6D4E\u578B\u5BA2\u6808 \u2192 \u7CBE\u54C1\u9152\u5E97", "text": "\u53E4\u57CE\u5185\u4ECE\u5E73\u4EF7\u5BA2\u6808\u5230\u5C0F\u578B\u7CBE\u54C1\u9152\u5E97\u4E00\u5E94\u4FF1\u5168\uFF0C\u591A\u4E3A\u5E97\u5C4B\u6539\u5EFA\u7684\u4F4E\u5C42\u5EFA\u7B51\u3002\u4F4F\u5728\u62A4\u57CE\u6CB3\u4EE5\u5185\uFF0C\u5BFA\u9662\u5373\u53EF\u6B65\u884C\u5230\u8FBE\u3002" }, { "icon": "\u{1F3EA}", "title": "\u5546\u8D85\u4E0E\u4FBF\u5229\u5E97", "type": "\u4FBF\u5229\u5E97 \xB7 \u5C0F\u578B\u8D85\u5E02 \xB7 \u836F\u623F", "text": "\u62A4\u57CE\u6CB3\u5185\u4E3B\u8981\u9053\u8DEF\u4E0A\u4FBF\u5229\u5E97\u4E0E\u5C0F\u578B\u8D85\u5E02\u5BC6\u96C6\uFF0C\u591A\u6570\u8425\u4E1A\u65F6\u95F4\u5F88\u957F\uFF1B\u62A4\u57CE\u6CB3\u9644\u8FD1\u8FD8\u6709\u4F20\u7EDF\u5E02\u573A\uFF0C\u53EF\u4E70\u6C34\u679C\u3001\u996E\u7528\u6C34\u4E0E\u65E5\u7528\u54C1\u3002" }, { "icon": "\u26FD", "title": "\u52A0\u6CB9\u4E0E\u5145\u7535", "type": "\u52A0\u6CB9\u7AD9 \xB7 \u516C\u5171\u5145\u7535\u6869", "text": "\u62A4\u57CE\u6CB3\u73AF\u8DEF\u4E0A\u7684\u52A0\u6CB9\u7AD9\u8F66\u7A0B\u7EA6 5 \u5206\u949F\uFF1B\u73AF\u8DEF\u6CBF\u7EBF\u7684\u5927\u578B\u5546\u573A\u4E0E\u90E8\u5206\u9152\u5E97\u8BBE\u6709\u7535\u52A8\u8F66\u4EA4\uFF0F\u76F4\u6D41\u5145\u7535\u6869\u3002" }, { "icon": "\u{1F3E5}", "title": "\u533B\u7597\u4E0E\u836F\u623F", "type": "\u836F\u623F \xB7 \u533B\u9662 10 \u2013 15 \u5206\u949F\u8F66\u7A0B", "text": "\u53E4\u57CE\u5185\u836F\u623F\u5F88\u5E38\u89C1\uFF0C\u53EF\u5904\u7406\u5C0F\u75C5\u5C0F\u75DB\u3002\u60C5\u51B5\u4E25\u91CD\u65F6\uFF0C\u7EFC\u5408\u533B\u9662\u4E0E\u79C1\u7ACB\u533B\u9662\u8F66\u7A0B\u7EA6 10\u201315 \u5206\u949F\uFF0C\u8BF7\u5907\u597D\u65C5\u884C\u4FDD\u9669\u4FE1\u606F\u3002" }, { "icon": "\u{1F3E7}", "title": "\u73B0\u91D1\u4E0E\u94F6\u884C", "type": "ATM \xB7 \u5151\u6362\u70B9", "text": "\u62A4\u57CE\u6CB3\u5185\u4E3B\u8981\u8857\u9053\u6709 ATM \u4E0E\u6301\u724C\u5151\u6362\u70B9\u3002\u5C0F\u5BFA\u5E99\u4E0E\u5E02\u96C6\u644A\u4F4D\u53EA\u6536\u73B0\u91D1\uFF0C\u5EFA\u8BAE\u7559\u4E9B\u7EB8\u5E01\u7528\u4E8E\u968F\u559C\u4E0E\u5C0F\u5403\u3002" }], "walkingNote": "\u4ECE\u5BFA\u95E8\u7B97\u8D77\uFF1A\u4FBF\u5229\u5E97 2\u20134 \u5206\u949F \xB7 \u9910\u9986 3\u20135 \u5206\u949F \xB7 \u836F\u623F 5\u20138 \u5206\u949F \xB7 \u52A0\u6CB9\u7AD9\u8F66\u7A0B 5 \u5206\u949F\u3002" };
    responsibility = { "label": "\u79D1\u666E\u4E0E\u8BBF\u5BA2\u8D23\u4EFB", "heading": "\u5982\u4F55\u5F97\u4F53\u5730\u53C2\u89C2", "intro": "\u6E05\u66FC\u5BFA\u65E2\u662F\u53E4\u8FF9\uFF0C\u4E5F\u662F\u5728\u8FD0\u884C\u7684\u5BFA\u9662\uFF0C\u7EA6\u516D\u5341\u4F4D\u50E7\u4FA3\u4E0E\u6C99\u5F25\u5728\u6B64\u751F\u6D3B\u4FEE\u5B66\u3002\u770B\u61C2\u773C\u524D\u7684\u4E1C\u897F\uFF0C\u53C2\u89C2\u4F53\u9A8C\u4F1A\u66F4\u597D\uFF1B\u591A\u4E00\u5206\u514B\u5236\uFF0C\u5B83\u624D\u80FD\u4E00\u76F4\u8FD9\u6837\u3002", "groups": [{ "title": "\u7740\u88C5\u4E0E\u5165\u5185", "points": ["\u906E\u4F4F\u80A9\u8180\u4E0E\u819D\u76D6\uFF0C\u968F\u8EAB\u5E26\u4E00\u6761\u8584\u56F4\u5DFE\u51E0\u4E4E\u80FD\u89E3\u51B3\u6240\u6709\u60C5\u51B5\u3002", "\u8FDB\u5165\u6BBF\u5802\u524D\u8131\u978B\uFF0C\u811A\u638C\u5207\u52FF\u671D\u5411\u4F5B\u50CF\u3002", "\u6BBF\u5185\u6458\u5E3D\uFF1B\u95E8\u69DB\u8981\u8DE8\u8FC7\uFF0C\u4E0D\u8981\u8E29\u8E0F\u3002"] }, { "title": "\u884C\u4E3A\u4E0E\u5B89\u9759", "points": ["\u653E\u4F4E\u97F3\u91CF\uFF1A\u591A\u6570\u6E05\u6668\u4E0E\u508D\u665A\u90FD\u6709\u8BF5\u7ECF\u4E0E\u8BFE\u4E1A\u3002", "\u4E0D\u8981\u89E6\u78B0\u58C1\u753B\u3001\u4F5B\u50CF\u4E0E\u6728\u96D5\u2014\u2014\u76AE\u80A4\u6CB9\u8102\u4F1A\u9020\u6210\u6C38\u4E45\u6027\u635F\u4F24\u3002", "\u62CD\u6444\u50E7\u4EBA\u524D\u5148\u5F81\u6C42\u540C\u610F\uFF0C\u7EDD\u4E0D\u62CD\u6444\u6B63\u5728\u793C\u62DC\u7684\u4EBA\u3002"] }, { "title": "\u4F9B\u517B\u4E0E\u73AF\u5883", "points": ["\u5165\u5BFA\u514D\u8D39\uFF0C\u968F\u559C\u4F9B\u517B\u51FA\u4E8E\u81EA\u613F\uFF0C\u7528\u9014\u662F\u5BFA\u9662\u65E5\u5E38\u7EF4\u62A4\u3002", "\u4E0D\u7559\u5783\u573E\uFF0C\u5C3D\u91CF\u81EA\u5E26\u6C34\u676F\u2014\u2014\u53E4\u57CE\u5185\u6709\u591A\u5904\u8865\u6C34\u70B9\u3002", "\u672A\u7ECF\u4E66\u9762\u8BB8\u53EF\uFF0C\u5BFA\u9662\u5185\u4E0D\u4F7F\u7528\u65E0\u4EBA\u673A\u4E0E\u4E09\u811A\u67B6\u3002"] }], "pledge": "\u62CD\u7167\u5E26\u8D70\uFF0C\u4EC0\u4E48\u90FD\u4E0D\u7559\u4E0B\uFF0C\u8BA9\u5728\u6B64\u793C\u4F5B\u7684\u4EBA\u51B3\u5B9A\u8282\u594F\u2014\u2014\u8FD9\u5C31\u662F\u5168\u90E8\u793C\u4EEA\u3002", "scienceNote": "\u4E3A\u4EC0\u4E48\u91CD\u8981\uFF1A\u6CF0\u5317\u7684\u7070\u6CE5\u58C1\u753B\u3001\u67DA\u6728\u5EFA\u7B51\u4E0E\u7802\u5CA9\u6D6E\u96D5\u5728\u6E7F\u70ED\u6C14\u5019\u4E0B\u80FD\u7559\u5B58\u4E0B\u6765\uFF0C\u9760\u7684\u662F\u65E5\u590D\u4E00\u65E5\u7684\u7167\u770B\u3002\u6E7F\u5EA6\u3001\u95EA\u5149\u706F\u4E0E\u89E6\u6478\uFF0C\u662F\u8BA9\u5B83\u4EEC\u8001\u5316\u6700\u5FEB\u7684\u4E09\u4EF6\u4E8B\u3002" };
    legends = { "label": "\u6545\u4E8B\u4E0E\u7F16\u5E74\u53F2", "heading": "\u6E05\u66FC\u5BFA\u7684\u4F20\u8BF4", "intro": "\u6CF0\u5317\u5386\u53F2\u4E3B\u8981\u8BB0\u5F55\u5728\u8D1D\u53F6\u7F16\u5E74\u53F2\uFF08tamnan\uFF09\u4E2D\uFF0C\u53F2\u5B9E\u3001\u4FE1\u4EF0\u4E0E\u738B\u5BA4\u53D9\u4E8B\u5E38\u5E38\u5E76\u5B58\u3002\u4EE5\u4E0B\u662F\u4E0E\u6E05\u66FC\u5BFA\u76F8\u5173\u7684\u51E0\u5219\u6545\u4E8B\u3002", "stories": [{ "tag": "\u5EFA\u57CE", "title": "\u767D\u8C61\u505C\u9A7B\u4E4B\u5730", "text": "\u4F20\u8BF4\u5B5F\u83B1\u738B\u4E3A\u5BFB\u627E\u65B0\u90FD\uFF0C\u4E00\u8DEF\u52D8\u5BDF\uFF1B\u4E00\u5934\u767D\u8C61\u2014\u2014\u672C\u5730\u738B\u6743\u7684\u6700\u9AD8\u8C61\u5F81\u2014\u2014\u8D70\u5230\u6B64\u5904\u505C\u4E0B\uFF0C\u9E23\u53EB\u4E09\u58F0\u540E\u4E0D\u80AF\u518D\u8D70\u3002\u738B\u4FBF\u5728\u6B64\u624E\u8425\uFF0C\u79F0\u300CWiang Chiang Man\u300D\uFF08\u5B5F\u83B1\u4E4B\u57CE\uFF09\uFF0C\u540E\u6765\u7684\u6E05\u8FC8\u57CE\u6B63\u662F\u7531\u8FD9\u5EA7\u8425\u76D8\u5411\u5916\u751F\u957F\u800C\u6210\u3002" }, { "tag": "\u5723\u7269", "title": "\u6C34\u6676\u4F5B Phra Sae Tang Khamani", "text": "\u4E00\u5C0A\u4EE5\u901A\u900F\u6C34\u6676\u96D5\u6210\u7684\u5C0F\u4F5B\u50CF\uFF0C\u76F8\u4F20\u6765\u81EA\u5B5F\u65CF\u738B\u56FD\u7F57\u6DA1\uFF08\u4ECA\u534E\u5BCC\u91CC\uFF09\uFF0C\u7531\u5B5F\u83B1\u738B\u4EB2\u81EA\u5E26\u5F80\u5317\u65B9\u3002\u4F20\u7EDF\u8BA4\u4E3A\u5B83\u80FD\u62A4\u4F51\u57CE\u5E02\u514D\u4E8E\u98CE\u66B4\u4E0E\u706B\u707E\u3002\u5E73\u65E5\u4F9B\u5949\u4E8E\u9AD8\u811A\u85CF\u7ECF\u9601\uFF0C\u6BCF\u5E74 4 \u6708\u5B8B\u5E72\u8282\u516C\u5F00\u5C55\u51FA\u3002" }, { "tag": "\u7948\u96E8", "title": "\u77F3\u4F5B Phra Sila \u4E0E\u6C42\u96E8", "text": "\u7802\u5CA9\u6D6E\u96D5\u4F5B\u50CF Phra Sila \u662F\u5BFA\u4E2D\u53E6\u4E00\u4EF6\u91CD\u5668\u3002\u56E0\u4E0E\u964D\u96E8\u76F8\u5173\uFF0C\u5B8B\u5E72\u8282\u65F6\u4F1A\u88AB\u62AC\u51FA\u5BFA\u5916\u5DE1\u57CE\uFF0C\u6C11\u4F17\u4EE5\u9999\u6C34\u6DCB\u6D12\uFF0C\u7948\u6C42\u98CE\u8C03\u96E8\u987A\u3002" }, { "tag": "\u76DF\u7EA6", "title": "\u4E09\u738B\u4E4B\u7EA6", "text": "\u5EFA\u57CE\u4E4B\u524D\uFF0C\u5170\u7EB3\u7684\u5B5F\u83B1\u738B\u3001\u7D20\u53EF\u6CF0\u7684\u5170\u7518\u4EA8\u738B\u4E0E\u5E15\u5C27\u7684\u5357\u8499\u738B\u636E\u4F20\u66FE\u7ACB\u4E0B\u76DF\u7EA6\uFF0C\u7A33\u4F4F\u4E86\u6CF0\u5317\u8BF8\u6CB3\u8C37\u3002\u8DDD\u5BFA\u4E0D\u8FDC\u7684\u4E09\u738B\u7EAA\u5FF5\u7891\u6B63\u662F\u4E3A\u6B64\u800C\u7ACB\u2014\u2014\u8FD9\u4E5F\u89E3\u91CA\u4E86\u4E3A\u4F55\u53E4\u57CE\u8FD9\u4E00\u89D2\u88AB\u89C6\u4E3A\u57CE\u5E02\u539F\u70B9\u3002" }, { "tag": "\u8C61\u5F81", "title": "\u90A3\u4F3D\u3001\u5927\u8C61\u4E0E\u5B88\u62A4\u86C7\u795E", "text": "\u4F5B\u6BBF\u697C\u68AF\u4E24\u4FA7\u662F\u4EE5\u90A3\u4F3D\uFF08\u4F5B\u6559\u5B87\u5B99\u89C2\u4E2D\u7684\u86C7\u5F62\u6C34\u795E\uFF09\u4E3A\u5F62\u7684\u6276\u624B\uFF0C\u5927\u4F5B\u5854\u5219\u7531\u6210\u6392\u77F3\u8C61\u627F\u6258\u3002\u4E24\u8005\u7528\u77F3\u5934\u8BF4\u660E\u4E86\u8FD9\u5EA7\u5BFA\u7684\u7ACB\u610F\uFF1A\u4F5B\u6CD5\u7531\u5927\u5730\u7684\u529B\u91CF\u6258\u4E3E\u3002" }], "note": "\u4EE5\u4E0A\u4E3A\u7F16\u5E74\u53F2\u4F20\u7EDF\u800C\u975E\u4FE1\u53F2\u3002\u5F53\u7F16\u5E74\u53F2\u4E0E\u8003\u53E4\u7ED3\u8BBA\u51B2\u7A81\u65F6\uFF0C\u7891\u94ED\u4E0E\u53D1\u6398\u62A5\u544A\u66F4\u53EF\u9760\uFF1B\u4F46\u5F53\u5730\u4EBA\u8BB2\u8FD9\u4E9B\u6545\u4E8B\uFF0C\u5DF2\u7ECF\u8BB2\u4E86\u4E03\u767E\u5E74\u3002" };
    hero = { "titleMain": "\u6E05\u66FC\u5BFA", "titleAccent": "\u6E05\u66FC", "eyebrow": "\u6E05\u8FC8\u53E4\u57CE \xB7 \u5EFA\u4E8E 1296 \u5E74", "subtitle": "\u6E05\u8FC8\u6700\u53E4\u8001\u7684\u5BFA\u5E99\uFF0C\u5B5F\u83B1\u738B\u5EFA\u57CE\u65F6\u6700\u521D\u9A7B\u8DF8\u4E4B\u5730 \u2014\u2014 \u7C89\u5899\u3001\u67DA\u6728\u7ACB\u67F1\u4E0E\u8C61\u6258\u4F5B\u5854\u6784\u6210\u7684\u5170\u7EB3\u9759\u8C27\u5723\u5883\u3002", "cta1": "\u89C4\u5212\u884C\u7A0B", "cta2": "\u67E5\u770B\u5730\u56FE", "rating": "4.7", "reviewCount": "6,192 \u6761 Google \u8BC4\u4EF7", "coordsLabel": "\u6E05\u8FC8\u53E4\u57CE", "viewLocation": "\u5728 Google Maps \u67E5\u770B\u4F4D\u7F6E", "titleCity": "\u6E05\u8FC8", "heroAlt": "\u6E05\u66FC\u5BFA - \u6CF0\u56FD\u6E05\u8FC8\u4E3B\u666F", "boardCategory": "\u4E00\u89C8", "boardTitle": "\u6E05\u66FC\u5BFA", "boardEn": "\u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19 \xB7 Chiang Mai, Thailand", "plannerTitle": "\u9EC4\u91D1\u65F6\u523B\u89C4\u5212", "liveWeather": "\u5B9E\u65F6\u5929\u6C14", "plannerNote": "\u9EC4\u91D1\u65F6\u523B\u968F\u5B63\u8282\u53D8\u5316\uFF0C\u4EC5\u4F5C\u53C2\u8003\u3002", "defaultTemp": "28\xB0C", "defaultCond": "\u6674\u6717", "defaultWind": "5 \u516C\u91CC/\u65F6", "sunsetIndexLabel": "\u5149\u7EBF\u6307\u6570", "sunsetIndexDefault": "\u6781\u4F73", "goldenHourLabel": "\u9EC4\u91D1\u65F6\u523B", "sunsetLabel": "\u65E5\u843D", "blueHourLabel": "\u84DD\u8C03\u65F6\u523B", "defaultGolden": "18:10", "defaultSunset": "18:50", "defaultBlue": "19:10", "crowdWarningLabel": "\u4EBA\u6D41\u63D0\u793A", "defaultTip": "08:00 \u524D\u4E0E 17:00 \u540E\u6700\u5B89\u9759\uFF0C\u6E05\u6668\u5149\u7EBF\u6700\u9002\u5408\u62CD\u7167\u3002", "lightCaption": "\u5149\u7EBF\u9884\u6D4B\u91C7\u7528\u5F53\u5730\u592A\u9633\u65F6\uFF08Asia/Bangkok\uFF09\u3002", "weatherError": "\u5929\u6C14\u6682\u4E0D\u53EF\u7528", "goldenChanceLabel": "\u9EC4\u91D1\u65F6\u523B\u6982\u7387", "quickFacts": { "duration": "\u5EFA\u8BAE\u7528\u65F6", "durationVal": "\u7EA6 45 \u5206\u949F", "fee": "\u95E8\u7968\u8D39\u7528", "feeVal": "\u514D\u8D39\uFF08\u63A5\u53D7\u6350\u8D60\uFF09", "dress": "\u7740\u88C5\u8981\u6C42", "dressVal": "\u906E\u80A9\u76D6\u819D \xB7 \u9700\u8131\u978B", "mustSee": "\u4E09\u5927\u5FC5\u770B", "mustSeeVal": "\u8C61\u6258\u4F5B\u5854 \xB7 \u6C34\u6676\u4F5B \xB7 \u77F3\u4F5B" } };
    about = { "label": "\u5173\u4E8E", "heading": "\u6E05\u8FC8\u7684\u7B2C\u4E00\u5EA7\u5BFA\u5E99", "headingEntity": "\u5173\u4E8E\u6E05\u66FC\u5BFA \u2014\u2014 \u6E05\u8FC8\u7684\u7B2C\u4E00\u5EA7\u5BFA\u5E99", "entityLead": "\u6B22\u8FCE\u6765\u5230**\u6E05\u66FC\u5BFA\uFF08Wat Chiang Man / \u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\uFF09** \u2014\u2014 \u6B63\u662F **watchiangman.com** \u57DF\u540D\u6240\u6307\u7684\u90A3\u5EA7\u5BFA\u5E99\u3002\u5B83\u5750\u843D\u4E8E**\u6CF0\u56FD****\u6E05\u8FC8\u5E9C****\u6E05\u8FC8**\u53E4\u57CE\u7684\u6838\u5FC3\u5730\u5E26\uFF0C\u662F\u6E05\u8FC8\u62A4\u57CE\u6CB3\u5185\u6700\u53E4\u8001\u7684\u5BFA\u5E99\uFF0C\u4E5F\u662F\u9020\u8BBF\u672C\u5730\u65C5\u5BA2\u7684\u9996\u8981\u5730\u6807\u3002", "lead": "\u9690\u4E8E\u53E4\u57CE\u5317\u9685\u7684\u6E05\u9759\u4E4B\u5730\uFF0C\u6E05\u66FC\u5BFA\u6B63\u662F\u6E05\u8FC8\u7684\u8D77\u70B9 \u2014\u2014 \u65E2\u662F\u5723\u5730\uFF0C\u4E5F\u66FE\u662F\u738B\u5C45\u3002", "paragraph1": "1296 \u5E74\uFF0C\u5170\u7EB3\u56FD\u738B\u5B5F\u83B1\u738B\uFF08Mangrai\uFF09\u9009\u5740\u4E8E\u6B64\u4F5C\u4E3A\u5EFA\u57CE\u7684\u5927\u672C\u8425\uFF0C\u5E76\u642D\u5EFA\u884C\u5BAB\u9A7B\u8DF8\uFF0C\u76F4\u81F3\u65B0\u57CE\u6210\u578B \u2014\u2014 \u8FD9\u4F7F\u6E05\u66FC\u5BFA\u6210\u4E3A\u6E05\u8FC8\u62A4\u57CE\u6CB3\u5185\u6700\u53E4\u8001\u7684\u5BFA\u5E99\u3002", "paragraph2": "\u6570\u767E\u5E74\u540E\uFF0C\u8FD9\u91CC\u4ECD\u662F\u6D3B\u8DC3\u7684\u793C\u4F5B\u4E4B\u6240\u3002\u7C89\u5899\u3001\u6591\u9A73\u67DA\u6728\u4E0E\u5C0F\u5DE7\u89C4\u6A21\uFF0C\u8D4B\u4E88\u5B83\u5927\u5BFA\u6240\u65E0\u7684\u4EB2\u5207\u611F\uFF0C\u540C\u65F6\u5B88\u62A4\u7740\u5170\u7EB3\u6700\u53D7\u5D07\u656C\u7684\u4E24\u5C0A\u4F5B\u50CF\u3002", "quote": "\u201C\u7ACB\u4E8E\u6E05\u66FC\u5BFA\uFF0C\u4FBF\u662F\u7ACB\u4E8E\u6E05\u8FC8\u8BDE\u751F\u4E4B\u5904\u3002\u201D", "quoteAuthor": "\u2014\u2014 \u5170\u7EB3\u7F16\u5E74\u53F2", "etymology": { "tag": "\u8BCD\u6E90", "title": "\u201C\u6E05\u66FC\u201D\u4F55\u610F", "text": "\u5728\u5170\u7EB3\u8BED\uFF0F\u6CF0\u8BED\u4E2D\uFF0C\u201CChiang\u201D\uFF08\u0E40\u0E0A\u0E35\u0E22\u0E07\uFF09\u610F\u4E3A\u201C\u57CE\u5E02\u201D\uFF0C\u201CMan\u201D\uFF08\u0E21\u0E31\u0E48\u0E19\uFF09\u610F\u4E3A\u201C\u7A33\u56FA\u3001\u957F\u9752\u201D\u3002\u201C\u6E05\u66FC\u201D\u5373\u201C\u7A33\u56FA\u4E4B\u57CE\u201D\uFF0C\u5BC4\u6258\u5B5F\u83B1\u738B\u5EFA\u57CE\u65F6\u5BF9\u65B0\u90FD\u957F\u6CBB\u4E45\u5B89\u7684\u7948\u613F\u3002" }, "stats": [{ "value": "1296", "label": "\u5B5F\u83B1\u738B\u521B\u7ACB" }, { "value": "\u7B2C\u4E00", "label": "\u6E05\u8FC8\u6700\u53E4\u8001\u5BFA\u5E99" }, { "value": "05:00\u201319:00", "label": "\u6BCF\u65E5\u5F00\u653E" }], "highlights": [{ "tag": "\u6C34\u6676\u4F5B", "title": "\u5E15\u5723\u5F53\u5361\u739B\u5C3C", "desc": "\u516C\u5143 11 \u4E16\u7EAA\u7684\u6C34\u6676\u7ACB\u4F5B\uFF0C\u88AB\u8BA4\u4E3A\u80FD\u62A4\u57CE\u964D\u96E8\u3002" }, { "tag": "\u77F3\u4F5B", "title": "\u5E15\u897F\u62C9", "desc": "\u4E0E\u65AF\u91CC\u5170\u5361\u53CA\u96E8\u5B63\u76F8\u5173\u7684\u5723\u77F3\u4F5B\u50CF\u3002" }, { "tag": "\u8C61\u6258\u4F5B\u5854", "title": "\u6E05\u66FC\u5F0F\u4F5B\u5854", "desc": "\u4E24\u5EA7\u65B9\u5F62\u4F5B\u5854\uFF0C\u5750\u843D\u4E8E\u7E41\u590D\u88C5\u9970\u7684\u8C61\u80CC\u4E4B\u4E0A\u3002" }], "editorTip": { "tag": "\u7F16\u8F91\u6CE8", "text": "\u8863\u7740\u7AEF\u5E84\uFF0C\u5165\u6BBF\u8131\u978B\uFF0C\u5E76\u5C3D\u91CF\u6E05\u6668\u5230\u8BBF\u4EE5\u4EAB\u9759\u8C27\u3002", "ctaLabel": "\u67E5\u770B\u6E38\u89C8\u63D0\u793A" } };
    arch = { "label": "\u5EFA\u7B51\u4E0E\u5723\u7269", "heading": "\u5170\u7EB3\u738B\u5BA4\u7684\u795E\u5723\u827A\u672F", "intro": "\u6E05\u66FC\u5BFA\u662F\u4E00\u5EA7\u8896\u73CD\u7684\u5170\u7EB3\u5DE5\u827A\u535A\u7269\u9986 \u2014\u2014 \u4ECE\u8C61\u6258\u65B9\u5854\u5230\u8FD1\u5343\u5E74\u6765\u5438\u5F15\u4FE1\u4F17\u7684\u4E24\u5C0A\u5C0F\u4F5B\u50CF\u3002", "treasuresTitle": "\u4E24\u5C0A\u4F5B\u50CF\uFF0C\u6570\u4E16\u7EAA\u4FE1\u4EF0", "treasures": [{ "tag": "\u5E15\u5723\u5F53\u5361\u739B\u5C3C", "title": "\u6C34\u6676\u4F5B", "text": "\u6574\u5757\u6C34\u6676\u96D5\u6210\uFF0C\u7EA6\u516C\u5143 11 \u4E16\u7EAA\uFF0C\u53C8\u79F0\u5E15\u5A07\uFF08Phra Kaew Khao\uFF0C\u767D\u5B9D\u77F3\uFF09\u3002\u5B8B\u5E72\u8282\u65F6\u7ED5\u53E4\u57CE\u5DE1\u6E38\u4EE5\u7948\u96E8\u7EB3\u798F\u3002" }, { "tag": "\u5E15\u897F\u62C9", "title": "\u77F3\u4F5B", "text": "\u7802\u5CA9\u6D6E\u96D5\u4F5B\u50CF\uFF0C\u4E0E\u65AF\u91CC\u5170\u5361\u76F8\u5173\uFF0C\u957F\u4E45\u4EE5\u6765\u88AB\u8BA4\u4E3A\u638C\u63A7\u96E8\u6C34\uFF0C\u4FE1\u4F17\u4ECD\u7948\u6C42\u62A4\u4F51\u4E0E\u4E30\u6536\u3002" }], "archTitle": "\u770B\u70B9", "architecture": [{ "title": "\u8C61\u6258\u4F5B\u5854", "desc": "\u4E24\u5EA7\u7ACB\u65B9\u4F5B\u5854\uFF0813 \u4E16\u7EAA\uFF09\u7ACB\u4E8E\u7070\u5851\u5927\u8C61\u5C42\u53E0\u4E4B\u4E0A \u2014\u2014 \u6E05\u66FC\u5BFA\u72EC\u6709\u7684\u300E\u6E05\u66FC\u5F0F\u300F\u9020\u578B\uFF0C\u5EFA\u7B51\u5B66\u540D Chedi Chang Lom\uFF08\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E0A\u0E49\u0E32\u0E07\u0E25\u0E49\u0E2D\u0E21\uFF0C\u8C61\u56F4\u7ED5\u4F5B\u5854\uFF09\u3002" }, { "title": "\u5927\u96C4\u5B9D\u6BBF\uFF08Viharn Luang\uFF09", "desc": "\u4E3B\u6BBF\uFF0C1920 \u5E74\u4EE3\u4E8E\u539F\u57FA\u5740\u91CD\u5EFA\uFF0C\u53E4\u8001\u67DA\u6728\u67F1\u4ECD\u4FDD\u7559\u4E8E\u5185\u3002" }, { "title": "\u6212\u5802\uFF08Ubosot\uFF09", "desc": "\u8F83\u5C0F\u800C\u5B89\u9759\u7684\u6BBF\u5802\uFF0C\u7528\u4E8E\u50E7\u4FA3\u4EEA\u8F68\uFF0C\u5170\u7EB3\u6728\u4F5C\u7CBE\u7F8E\u3002" }], "noteTag": "\u6E38\u89C8\u63D0\u793A", "noteText": "\u4E24\u5C0A\u5723\u7269\u4F9B\u5949\u4E8E\u53F3\u4FA7\u7684\u85CF\u7ECF\u9601\uFF08ho trai\uFF09\uFF0C\u82E5\u60F3\u8FD1\u89C2\u53EF\u5411\u50E7\u4EBA\u8BF7\u6C42\u3002" };
    history = { "label": "\u5386\u53F2", "heading": "\u4ECE\u738B\u8425\u5230\u57CE\u5E02\u5723\u5FC3", "headingEntity": "\u6E05\u66FC\u5BFA\u7684\u5386\u53F2\u4E0E\u610F\u4E49", "compareBefore": "\u6E05\u66FC\u5BFA\u4E3B\u6BBF\u6B63\u9762", "compareAfter": "\u5927\u8C61\u627F\u6258\u7684\u4F5B\u5854", "compareHint": "\u5411\u5DE6\u53F3\u62D6\u62FD\u6ED1\u5757\uFF0C\u5BF9\u6BD4\u5EFA\u7B51\u7EC6\u90E8", "intro": "\u6E05\u66FC\u5BFA\u7684\u6545\u4E8B\u5C31\u662F\u6E05\u8FC8\u5EFA\u57CE\u7684\u6545\u4E8B \u2014\u2014 \u59CB\u4E8E\u56FD\u738B\u7684\u884C\u5BAB\uFF0C\u6210\u957F\u4E3A\u57CE\u5E02\u7684\u7CBE\u795E\u6838\u5FC3\u3002", "blocks": [{ "date": "1296", "title": "\u5B5F\u83B1\u738B\u9A7B\u8DF8", "text": "\u5170\u7EB3\u738B\u5B5F\u83B1\u9009\u62E9\u6B64\u5730\u4F5C\u4E3A\u5EFA\u57CE\u603B\u90E8\uFF0C\u9A7B\u4E8E\u884C\u5BAB\uFF0C\u540E\u6210\u4E3A\u5BFA\u5E99\u7684\u6838\u5FC3\u3002" }, { "date": "13\u201314 \u4E16\u7EAA", "title": "\u8C61\u6258\u4F5B\u5854", "text": "\u8C61\u80CC\u4E0A\u7684\u4E24\u5EA7\u65B9\u5854\u843D\u6210\uFF0C\u786E\u7ACB\u4E86\u72EC\u7279\u7684\u6E05\u66FC\u5F0F\u5EFA\u7B51\u98CE\u683C\u3002" }, { "date": "1920 \u5E74\u4EE3", "title": "\u91CD\u5EFA\u5927\u6BBF", "text": "\u4E3B\u6BBF\u5728\u539F\u5740\u91CD\u5EFA\uFF0C\u4FDD\u7559\u4E86\u53E4\u8001\u7684\u67DA\u6728\u7ACB\u67F1\u3002" }, { "date": "\u4ECA\u65E5", "title": "\u6D3B\u7684\u5BFA\u5E99", "text": "\u6E05\u66FC\u5BFA\u4ECD\u662F\u6D3B\u8DC3\u5BFA\u9662\uFF0C\u4E5F\u662F\u6E05\u8FC8\u5386\u53F2\u540D\u5BFA\u4E2D\u6700\u53D7\u8BBF\u7684\u4E00\u5904\u3002" }], "legend": { "title": "\u547C\u96E8\u4E4B\u4F5B", "text": "\u5E15\u5723\u5F53\u5361\u739B\u5C3C\u4E0E\u5E15\u897F\u62C9\u7686\u88AB\u8BA4\u4E3A\u53EF\u638C\u96E8\u6C34\u3002\u65F1\u65F6\u66FE\u8FCE\u6C34\u6676\u4F5B\u5DE1\u6E38\u4EE5\u5524\u5B63\u98CE\u96E8\u3002" }, "didYouKnow": { "title": "\u4F60\u77E5\u9053\u5417\uFF1F", "text": "\u6E05\u66FC\u5BFA\u4F4D\u4E8E\u53E4\u57CE\u897F\u5317\u9685\u7684\u62A4\u57CE\u6CB3\u5185 \u2014\u2014 \u6B63\u662F\u5B5F\u83B1\u6700\u521D\u89C4\u5212\u90FD\u57CE\u4E4B\u5904\u3002" }, "folklore": { "title": "\u547C\u96E8\u7684\u6C34\u6676", "tale": "\u5F53\u5730\u4F20\u8BF4\u767D\u6C34\u6676\u4F5B\u4EE5\u5929\u6C14\u300E\u8BF4\u8BDD\u300F\uFF1A\u5B8B\u5E72\u8282\u8FCE\u51FA\uFF0C\u5929\u5373\u964D\u96E8\u3001\u7A3B\u7530\u5F97\u996E\u3002\u519C\u4EBA\u4ECD\u89C6\u5176\u5DE1\u6E38\u4E3A\u6765\u5E74\u5409\u5146\u3002", "shrineTitle": "\u4F55\u5904\u53EF\u89C1", "shrine": "\u6C34\u6676\u4F5B\u4F9B\u5949\u4E8E\u5BFA\u9662\u53F3\u4FA7\u85CF\u7ECF\u9601\uFF0C\u6BCF\u5E74\u56DB\u6708\u5B8B\u5E72\u8282\u5411\u516C\u4F17\u5C55\u51FA\u3002" } };
    guide = { "label": "\u6E38\u89C8\u6307\u5357", "heading": "\u89C4\u5212\u4E00\u6B21\u5B89\u9759\u800C\u606D\u656C\u7684\u53C2\u8BBF", "lead": "\u6E05\u66FC\u5BFA\u514D\u8D39\u5F00\u653E\uFF0C\u4ECE\u53E4\u57CE\u4EFB\u4F55\u5904\u6B65\u884C\u53EF\u8FBE\uFF0C\u7A0D\u4F5C\u89C4\u5212\u4F53\u9A8C\u66F4\u4F73\u3002", "hub": { "t1": "\u4EA4\u901A\u4E0E\u95E8\u7968", "t2": "\u6444\u5F71\u5EFA\u8BAE\u4E0E\u5149\u7EBF", "t3": "\u793C\u4EEA\u4E0E\u7740\u88C5", "t4": "\u65E0\u969C\u788D\u8BBE\u65BD" }, "hours": { "tag": "\u5F00\u653E\u65F6\u95F4", "time": "05:00 \u2013 19:00", "items": [{ "label": "\u5149\u7EBF\u6700\u4F73", "value": "06:00 \u2013 08:00" }, { "label": "\u6700\u5B89\u9759", "value": "\u6E05\u6668\u4E0E 17:00 \u540E" }, { "label": "\u95ED\u9986", "value": "\u4E0D\u95ED\u9986\uFF08\u6BCF\u65E5\uFF09" }] }, "fees": { "tag": "\u95E8\u7968\u4E0E\u4F9B\u517B", "title": "\u8D39\u7528", "items": [{ "title": "\u5165\u5BFA", "desc": "\u514D\u8D39\u3002\u5728\u644A\u4F4D\u5C0F\u989D\u4F9B\u517B\u4EE5\u652F\u6301\u7EF4\u62A4\u4E0E\u50E7\u56E2\u3002" }, { "title": "\u7740\u88C5", "desc": "\u906E\u80A9\u76D6\u819D\uFF1B\u6240\u6709\u6BBF\u5802\u5185\u8131\u978B\u3002" }, { "title": "\u62CD\u7167", "desc": "\u9662\u5185\u53EF\u62CD\uFF1B\u52FF\u7528\u95EA\u5149\uFF0C\u672A\u7ECF\u8BB8\u53EF\u4E0D\u62CD\u50E7\u4FA3\u3002" }] }, "transport": { "tag": "\u4EA4\u901A", "title": "\u5982\u4F55\u62B5\u8FBE", "items": [{ "title": "\u4ECE\u673A\u573A\u51FA\u53D1", "desc": "\u6E05\u8FC8\u56FD\u9645\u673A\u573A\u8DDD\u53E4\u57CE\u7EA6 5 \u516C\u91CC\uFF0C\u4E58\u8F66\u7EA6 15\u201320 \u5206\u949F\u3002\u5177\u4F53\u6B65\u9AA4\u5982\u4E0B\uFF1A", "steps": ["\u62B5\u8FBE\u6E05\u8FC8\u56FD\u9645\u673A\u573A\uFF08CNX\uFF09\u56FD\u5185\u6216\u56FD\u9645\u5230\u8FBE\u5927\u5385\u3002", "\u5728\u673A\u573A 1 \u53F7\u51FA\u53E3\u9644\u8FD1\u7684\u5B98\u65B9\u51FA\u79DF\u8F66\u67DC\u53F0\u53EB\u8F66\uFF0C\u6216\u4F7F\u7528 Grab/Bolt App \u547C\u53EB\u7F51\u7EA6\u8F66\uFF08\u8D39\u7528\u7EA6 150\u2013200 \u6CF0\u94E2\uFF09\u3002", "\u544A\u77E5\u53F8\u673A\u524D\u5F80\u53E4\u57CE\u5185\u7684\u201C\u6E05\u66FC\u5BFA\uFF08Wat Chiang Man\uFF09\u201D\u3002", "\u8F66\u8F86\u5C06\u76F4\u8FBE Ratchapakhinai \u8DEF\u7684\u5BFA\u5E99\u6B63\u95E8\uFF0C\u4E0B\u8F66\u5373\u53EF\u5165\u5BFA\u53C2\u89C2\u3002"] }, { "title": "\u6B65\u884C", "desc": "\u4ECE\u5854\u4F69\u95E8\u6216\u591A\u6570\u53E4\u57CE\u65C5\u9986\u6B65\u884C 10\u201315 \u5206\u949F\u3002" }, { "title": "\u7EA2\u9876\u53CC\u6761\u8F66", "desc": "\u642D\u4E58\u7EA2\u8272\u53CC\u6761\u8F66\uFF0C\u544A\u77E5\u53F8\u673A\u300EWat Chiang Man\u300F\uFF0C\u8FD1 Ratchapakhinai \u8DEF\u3002" }, { "title": "\u561F\u561F\u8F66 / Grab", "desc": "\u4ECE\u5E02\u4E2D\u5FC3\u4E58\u8F66\u77ED\u7A0B\u3001\u4FBF\u5B9C\u3002" }] }, "photography": { "title": "\u6444\u5F71\u6307\u5357", "intro": "\u5BFA\u9662\u6D45\u5899\u4E0E\u6E29\u6DA6\u67DA\u6728\u5728\u65E5\u5F71\u8FB9\u7F18\u71A0\u71A0\u751F\u8F89\u3002", "timesTitle": "\u6700\u4F73\u5149\u7EBF", "times": [{ "period": "\u9ECE\u660E", "desc": "\u67D4\u548C\u5747\u5300\u7684\u5149\u4E0E\u7A7A\u65F7\u5EAD\u9662 \u2014\u2014 \u9002\u5408\u8C61\u6258\u4F5B\u5854\u3002" }, { "period": "\u5348\u540E", "desc": "\u4F4E\u659C\u9633\u5149\u63A0\u8FC7\u7070\u5851\u5927\u8C61\u4E0E\u954F\u91D1\u6BBF\u5802\u3002" }], "spotsTitle": "\u62CD\u6444\u70B9", "spots": [{ "name": "\u8C61\u6258\u4F5B\u5854", "view": "\u4ECE\u5EAD\u9662\u4EF0\u671B\u8C61\u5C42\u3002", "tip": "\u4F4E\u89D2\u5EA6\u62CD\u51FA\u5854\u57FA\u7684\u9707\u64BC\u3002" }, { "name": "\u5927\u6BBF\u95E8\u5ECA", "view": "\u67DA\u6728\u6A90\u53E3\u6846\u666F\u3002", "tip": "\u7B49\u50E7\u4EBA\u6216\u5F53\u5730\u4EBA\u7ECF\u8FC7\u4F5C\u6BD4\u4F8B\u3002" }], "settingsTitle": "\u53C2\u6570", "settings": [{ "style": "\u5E7F\u89D2 / \u98CE\u666F", "camera": "f/8, ISO 200, 16\u201324mm", "phone": "0.5\xD7 / 1\xD7\uFF0C\u70B9\u6309\u4EE5\u5899\u4F53\u66DD\u5149" }, { "style": "\u7EC6\u8282 / \u8D28\u611F", "camera": "f/4, ISO 400, 50mm", "phone": "2\xD7\uFF0C\u7A33\u4F4F\u62CD\u7070\u5851" }], "tipsTitle": "\u793C\u4EEA", "tips": ["\u52FF\u7ACB\u4E8E\u5854\u4E0A\u6216\u6500\u722C\u3002", "\u7ED5\u884C\u800C\u975E\u8DE8\u8FC7\u62DC\u57AB\u4E0E\u4F9B\u54C1\u3002", "\u62CD\u6444\u793C\u62DC\u8005\u524D\u5148\u5F81\u5F97\u540C\u610F\u3002"] }, "bestTime": { "title": "\u6700\u4F73\u6E38\u89C8\u65F6\u8282", "intro": "\u6E05\u8FC8\u7EC8\u5E74\u6E29\u6696\uFF0C\u51C9\u5B63\u4E0E\u65F1\u5B63\u5BFA\u9662\u6700\u7F8E\u3002", "seasons": [{ "tag": "\u51C9", "months": "11\u20132 \u6708", "name": "\u6700\u4F73", "desc": "\u6E05\u6668\u5B9C\u4EBA\u3001\u5149\u7EBF\u6E05\u6717\uFF0C\u4E34\u8FD1\u5B8B\u5E72\u8282\u3002" }, { "tag": "\u70ED", "months": "3\u20135 \u6708", "name": "\u5B89\u9759\u660E\u4EAE", "desc": "\u6B63\u5348\u9177\u70ED \u2014\u2014 \u6E05\u6668\u524D\u5F80\uFF1B\u56DB\u6708\u5B8B\u5E72\u8282\u6709\u6C34\u6676\u4F5B\u5DE1\u6E38\u3002" }, { "tag": "\u96E8", "months": "6\u201310 \u6708", "name": "\u9752\u7FE0\u5B81\u9759", "desc": "\u5348\u540E\u9635\u96E8\u3001\u4EBA\u5C11\u3001\u5BFA\u56ED\u8471\u90C1\u3002" }] }, "safety": { "title": "\u5B89\u5168\u4E0E\u606D\u656C", "items": [{ "title": "\u8863\u7740\u7AEF\u5E84", "desc": "\u906E\u80A9\u76D6\u819D\uFF1B\u7EB1\u7B3C\u6216\u62AB\u80A9\u6709\u5E2E\u52A9\u3002" }, { "title": "\u770B\u7BA1\u8D22\u7269", "desc": "\u53E4\u57CE\u5BFA\u9662\u5B89\u5168\uFF0C\u4F46\u4EBA\u591A\u65F6\u59A5\u5584\u4FDD\u7BA1\u8D35\u91CD\u7269\u54C1\u3002" }, { "title": "\u6CE8\u610F\u9632\u6652", "desc": "\u5E26\u6C34 \u2014\u2014 3 \u81F3 5 \u6708\u6B63\u5348\u708E\u70ED\u3002" }] }, "accessibility": { "title": "\u65E0\u969C\u788D", "intro": "\u5BFA\u9662\u5730\u9762\u5E73\u5766\u3001\u51E0\u4E4E\u65E0\u53F0\u9636\uFF1B\u6BBF\u5802\u6709\u51E0\u5904\u95E8\u69DB\u3002", "items": [{ "title": "\u8DEF\u5F84", "desc": "\u94FA\u5E73\u6B65\u9053\u8FDE\u63A5\u5C71\u95E8\u3001\u4F5B\u5854\u4E0E\u6BBF\u5802\u3002" }, { "title": "\u8F6E\u6905", "desc": "\u5EAD\u9662\u53EF\u901A\u884C\uFF1B\u6BBF\u5185\u8F83\u7A84 \u2014\u2014 \u5FC5\u8981\u65F6\u8BF7\u50E7\u4EBA\u534F\u52A9\u3002" }, { "title": "\u7559\u610F\u73B0\u573A\u544A\u793A", "desc": "\u6212\u5802\uFF08Ubosot\uFF09\u7B49\u6838\u5FC3\u533A\u57DF\u6709\u65F6\u9650\u5236\u5165\u5185\u6216\u9700\u8131\u978B\uFF0C\u8BF7\u9075\u7167\u73B0\u573A\u6807\u5FD7\u4E0E\u50E7\u4EBA\u6307\u5F15\u3002" }] }, "faqTitle": "\u987B\u77E5", "faqs": [{ "q": "\u6E05\u66FC\u5BFA\u5728\u54EA\u91CC\uFF1F", "a": "\u6E05\u66FC\u5BFA\u4F4D\u4E8E\u6CF0\u56FD\u6E05\u8FC8\u5E9C\u6E05\u8FC8\u5E02 Si Phum \u53E4\u57CE Ratchapakhinai \u8DEF 171 \u53F7\uFF0C\u90AE\u7F16 50200\uFF08\u5750\u6807 18.7938, 98.9867\uFF09\uFF0C\u5728\u53E4\u57CE\u62A4\u57CE\u6CB3\u4E4B\u5185\u3002" }, { "q": "\u6E05\u66FC\u5BFA\u514D\u8D39\u53C2\u89C2\u5417\uFF1F", "a": "\u514D\u8D39\u3002\u6E05\u66FC\u5BFA\u662F\u516C\u5171\u5BFA\u5E99\uFF0C\u5168\u5E74\u514D\u8D39\u5F00\u653E\uFF1B\u6B22\u8FCE\u968F\u559C\u4F9B\u517B\uFF0C\u4F46\u4E0D\u5F3A\u5236\u3002" }, { "q": "\u6E05\u66FC\u5BFA\u6709\u591A\u53E4\u8001\uFF1F", "a": "\u7531\u5B5F\u83B1\u738B\u4E8E 1296 \u5E74\u521B\u7ACB\uFF0C\u662F\u6E05\u8FC8\u6700\u53E4\u8001\u7684\u5BFA\u5E99\u3002" }, { "q": "\u771F\u7684\u514D\u8D39\u5417\uFF1F", "a": "\u662F\u3002\u6B22\u8FCE\u4F9B\u517B\uFF0C\u4F46\u4E0D\u5F3A\u5236\u3002" }, { "q": "\u6E05\u66FC\u5BFA\u7684\u5F00\u653E\u65F6\u95F4\u662F\uFF1F", "a": "\u5BFA\u9662\u5EAD\u9662\u6BCF\u65E5\u7EA6 05:00\u201319:00 \u5F00\u653E\uFF0C\u5168\u5E74\u65E0\u4F11\u3002" }, { "q": "\u80FD\u770B\u5230\u6C34\u6676\u4F5B\u5417\uFF1F", "a": "\u4F9B\u5949\u4E8E\u85CF\u7ECF\u9601\uFF0C\u5B8B\u5E72\u8282\uFF08\u56DB\u6708\uFF09\u516C\u5F00\u5C55\u51FA\uFF1B\u5176\u4F59\u65F6\u95F4\u53EF\u5411\u50E7\u4EBA\u8BF7\u6C42\u3002" }, { "q": "\u5E94\u505C\u7559\u591A\u4E45\uFF1F", "a": "30\u201360 \u5206\u949F\u8DB3\u4EE5\u4ECE\u5BB9\u770B\u5B8C\u91CD\u70B9\u3002" }], "nearby": { "title": "\u53E4\u57CE\u5468\u8FB9", "headingEntity": "\u6E05\u66FC\u5BFA\u5468\u8FB9\u7684\u5730\u6807\u4E0E\u666F\u70B9", "cluster": "\u5230\u8BBF**\u6E05\u66FC\u5BFA**\u65F6\uFF0C\u6E38\u5BA2\u53EF\u8F7B\u677E\u987A\u8DEF\u63A2\u8BBF\u5468\u8FB9\u7684\u5386\u53F2\u5730\u6807\u4E0E\u666F\u70B9\uFF0C\u5305\u62EC**\u5E15\u8F9B\u5BFA**\u4E0E**\u4E09\u738B\u7EAA\u5FF5\u7891**\u3002", "items": [{ "name": "\u4E09\u738B\u7EAA\u5FF5\u7891", "desc": "\u57CE\u5E02\u8C61\u5F81\u6027\u5EFA\u57CE\u5E7F\u573A\uFF0C\u5411\u5357\u6B65\u884C 10 \u5206\u949F\u3002", "url": "https://maps.google.com/?q=Three+Kings+Monument+Chiang+Mai" }, { "name": "\u5E15\u8F9B\u5BFA", "desc": "\u5411\u897F 15 \u5206\u949F\u7684\u5927\u578B\u5170\u7EB3\u5BFA\u9662\u3002", "url": "https://maps.google.com/?q=Wat+Phra+Singh+Chiang+Mai" }, { "name": "\u5468\u65E5\u6B65\u884C\u8857", "desc": "\u6E05\u8FC8\u8457\u540D\u591C\u5E02\uFF0C\u5357\u9762 Ratchadamnoen \u8DEF\u3002", "url": "https://maps.google.com/?q=Sunday+Walking+Street+Chiang+Mai" }], "cta": "\u5728\u5730\u56FE\u4E0A\u63A2\u7D22\u66F4\u591A" } };
    food = { "label": "\u5468\u8FB9\u7F8E\u98DF", "heading": "\u50CF\u5F53\u5730\u4EBA\u4E00\u6837\u5403", "lead": "\u6E05\u66FC\u5BFA\u5468\u8FB9\u7684\u5DF7\u5F04\u91CC\u6EE1\u662F\u53E4\u57CE\u5496\u5561\u9986\u3001\u9762\u644A\u4E0E\u6CF0\u5317\u53A8\u623F\u3002", "dishes": [{ "tag": "\u9762\u98DF", "name": "\u5496\u55B1\u9762\uFF08Khao Soi\uFF09", "price": "\u0E3F50\u201370", "desc": "\u6E05\u8FC8\u540D\u83DC\u5496\u55B1\u9762\uFF0C\u53EF\u5728 Ratchaphakhinai \u8DEF\u5E97\u9762\u4E00\u8BD5\u3002" }, { "tag": "\u9999\u80A0", "name": "\u6CF0\u5317\u9999\u80A0\uFF08Sai Ua\uFF09", "price": "\u0E3F60", "desc": "\u9999\u8349\u732A\u8089\u80A0\uFF0C\u70E4\u5236\u914D\u8FA3\u6912\u3002" }, { "tag": "\u5C0F\u5403", "name": "\u6930\u9999\u714E\u997C", "price": "\u0E3F30", "desc": "\u94C1\u677F\u6930\u6D46\u7C73\u997C\uFF0C\u5916\u8106\u5185\u8F6F\u3002" }, { "tag": "\u5496\u5561", "name": "\u53E4\u57CE\u5496\u5561\u9986", "price": "\u0E3F50\u201390", "desc": "\u9759\u8C27\u5EAD\u9662\u5496\u5561\u9986\uFF0C\u9002\u5408\u5BFA\u524D\u6162\u65E9\u9910\u3002" }], "quote": { "text": "\u201C\u53E4\u57CE\u6700\u597D\u5403\u7684\u5496\u55B1\u9762\uFF0C\u79BB\u5BFA\u95E8\u53EA\u6709\u4E94\u5206\u949F\u6B65\u884C\u3002\u201D", "author": "\u2014\u2014 \u6E05\u8FC8\u5E38\u5BA2" } };
    gallery = { "label": "\u56FE\u96C6", "heading": "\u6E05\u66FC\u5BFA\u5185", "intro": "\u7A7F\u884C\u4E8E\u6BBF\u5802\u3001\u4F5B\u5854\u4E0E\u9759\u8C27\u89D2\u843D\u7684\u89C6\u89C9\u4E4B\u65C5\u3002", "credits": "\u56FE\u7247\u4E3A\u6E05\u66FC\u5BFA\u5EFA\u7B51\u4E0E\u73AF\u5883\u7684\u793A\u610F\u3002", "alts": ["\u6E05\u66FC\u5BFA\u5BFA\u9662", "\u7C89\u767D\u5927\u6BBF\u5899\u9762", "\u4E3B\u6BBF\u67DA\u6728\u7ACB\u67F1", "\u8C61\u6258\u4F5B\u5854", "\u7070\u5851\u5927\u8C61\u7EC6\u8282", "\u954F\u91D1\u4F5B\u50CF", "\u5927\u6BBF\u7ACB\u9762", "\u5BFA\u9662\u5EAD\u9662", "\u5170\u7EB3\u5C4B\u6A90", "\u6BBF\u5185\u793C\u4F5B\u533A", "\u77F3\u4F5B\u5E15\u897F\u62C9", "\u6C34\u6676\u4F5B\u9F9B", "\u84DD\u5929\u4E0B\u7684\u4F5B\u5854", "\u50E7\u820D", "\u5BFA\u56ED", "\u90A3\u4F3D\u6276\u68AF", "\u7CBE\u7F8E\u6A90\u9970", "\u949F\u697C", "\u5899\u4E0A\u7684\u66AE\u5149", "\u4FE1\u4F17\u70B9\u9999", "\u9644\u8FD1\u62A4\u57CE\u6CB3", "\u706F\u7B3C\u7EC6\u8282", "\u5BFA\u4E2D\u9759\u9685"], "viewLocation": "\u5728 Google Maps \u67E5\u770B\u4F4D\u7F6E" };
    reviews = { "label": "\u8BC4\u4EF7", "heading": "\u6E38\u5BA2\u600E\u4E48\u8BF4", "intro": "\u6E05\u66FC\u5BFA\u4EE5\u5B81\u9759\u6C1B\u56F4\u4E0E\u5386\u53F2\u4E4B\u7F8E\uFF0C\u957F\u671F\u83B7\u5F97\u9AD8\u5206\u8BC4\u4EF7\u3002", "disclaimer": "\u8BC4\u5206\u4E3A\u516C\u5F00\u8BBF\u5BA2\u53CD\u9988\u7684\u6C47\u603B\uFF0C\u4EC5\u4F9B\u53C2\u8003\u3002", "declaration": "\u672C\u7F51\u7AD9\u4E3A\u72EC\u7ACB\u6E38\u89C8\u6307\u5357\uFF0C\u4E0E\u5BFA\u9662\u6216 Google \u65E0\u96B6\u5C5E\u5173\u7CFB\u3002", "sourceNote": "\u540C\u6B65\u81EA Google \u5730\u56FE\u7528\u6237\u8BC4\u4EF7\uFF0C\u540C\u6B65\u65F6\u95F4 2026 \u5E74 9 \u6708\uFF1B\u7248\u6743\u5F52\u539F\u4F5C\u8005\u4E0E Google \u5730\u56FE\u6240\u6709", "sourceNotesLabel": "\u8BC4\u4EF7 \xB7 \u540C\u6B65\u65F6\u95F4 2026 \u5E74 9 \u6708", "viewAllCta": "\u5728\u8C37\u6B4C\u5730\u56FE\u67E5\u770B\u5168\u90E8\u8BC4\u4EF7", "featured": [{ "text": "\u201C\u53E4\u57CE\u4E2D\u6700\u53E4\u8001\u4E5F\u6700\u5B81\u9759\u7684\u5BFA\u5E99 \u2014\u2014 \u8C61\u6258\u4F5B\u5854\u4EE4\u4EBA\u96BE\u5FD8\u3002\u201D", "source": "Google \u8BC4\u4EF7" }, { "text": "\u201C\u65E9\u70B9\u6765\u3002\u5EAD\u9662\u53EA\u6709\u6211\u4EEC\uFF0C\u767D\u5899\u4E0A\u7684\u5149\u683C\u5916\u7F8E\u3002\u201D", "source": "Google \u8BC4\u4EF7" }], "items": [{ "text": "\u5C0F\u5DE7\u5374\u5145\u6EE1\u5386\u53F2\uFF0C\u6C34\u6676\u4F5B\u4EE4\u4EBA\u7740\u8FF7\u3002", "rating": "5", "name": "Anya R.", "date": "2026 \u5E74 3 \u6708" }, { "text": "\u7231\u4E0A\u8C61\u6258\u4F5B\u5854 \u2014\u2014 \u6E05\u8FC8\u522B\u5904\u6CA1\u6709\u3002", "rating": "5", "name": "Tom B.", "date": "2026 \u5E74 2 \u6708" }, { "text": "\u5B89\u9759\u4E14\u6574\u6D01\uFF0C\u6E05\u6668\u7684\u597D\u5F00\u7AEF\u3002", "rating": "4", "name": "Lin W.", "date": "2026 \u5E74 1 \u6708" }], "viewLocation": "\u5728 Google Maps \u67E5\u770B\u4F4D\u7F6E" };
    sources = { "label": "\u6765\u6E90\u4E0E\u7F72\u540D", "heading": "\u4FE1\u606F\u51FA\u5904", "intro": "\u5173\u952E\u4E8B\u5B9E\u53D6\u81EA\u516C\u5F00\u53C2\u8003\u8D44\u6599\uFF1B\u56FE\u7247\u4E3A\u5BFA\u9662\u793A\u610F\u3002", "photoTitle": "\u56FE\u7247\u7F72\u540D", "reviewTitle": "\u8BC4\u4EF7", "reviewNote": "\u8BC4\u4EF7 \xB7 \u540C\u6B65\u65F6\u95F4 2026 \u5E74 9 \u6708 \u2014\u2014 \u540C\u6B65\u81EA Google \u5730\u56FE\u7528\u6237\u8BC4\u4EF7\uFF1B\u7248\u6743\u5F52\u539F\u4F5C\u8005\u4E0E Google \u5730\u56FE\u6240\u6709\u3002\u8BC4\u4EF7\u4EC5\u5728\u9875\u9762\u5C55\u793A\uFF0C\u4E0D\u5199\u5165\u672C\u7AD9\u7ED3\u6784\u5316\u6570\u636E\u3002", "reviewLinkLabel": "\u5728\u8C37\u6B4C\u5730\u56FE\u67E5\u770B\u5168\u90E8\u8BC4\u4EF7", "weatherTitle": "\u5929\u6C14\u4E0E\u6C14\u5019\u6570\u636E", "weatherText": "\u5B9E\u65F6\u5929\u6C14\u4E0E 7 \u65E5\u9884\u62A5\u7531 Open-Meteo \u9884\u62A5\u670D\u52A1\u6309\u6E05\u66FC\u5BFA\u5750\u6807\u70B9\u751F\u6210\uFF1B\u5B63\u8282\u5E38\u5E74\u503C\u91C7\u7528\u4E16\u754C\u6C14\u8C61\u7EC4\u7EC7\uFF08WMO\uFF091991\u20132020 \u53C2\u8003\u671F\u7684\u6E05\u8FC8\u7AD9\u6570\u636E\u3002\u4EE5\u4E0A\u4FE1\u606F\u4E3A\u51FA\u884C\u53C2\u8003\uFF0C\u4E0D\u6784\u6210\u5B98\u65B9\u9884\u8B66\uFF0C\u6076\u52A3\u5929\u6C14\u8BF7\u9075\u4ECE\u5F53\u5730\u901A\u544A\u3002", "govTitle": "\u5B98\u65B9\u65C5\u6E38\u95E8\u6237", "govText": "\u5982\u9700\u5B98\u65B9\u66F4\u65B0\u4E0E\u5730\u533A\u65C5\u6E38\u4FE1\u606F\uFF0C\u8BF7\u8BBF\u95EE\u6CF0\u56FD\uFF0F\u6E05\u8FC8\u5B98\u65B9\u65C5\u6E38\u95E8\u6237\u3002", "govLinkLabel": "\u5B98\u65B9\u65C5\u6E38\u95E8\u6237", "photoItems": [{ "text": "\u56FE\u96C6\u56FE\u7247\u4E3A\u6E05\u66FC\u5BFA\u5EFA\u7B51\u4E0E\u73AF\u5883\u7684\u793A\u610F\u3002", "linkLabel": "\u53C2\u8003", "url": "https://en.wikipedia.org/wiki/Wat_Chiang_Man" }], "factTitle": "\u4E8B\u5B9E\u4E0E\u6838\u5B9E", "factText": "\u521B\u7ACB\u5E74\u4EFD\u3001\u6C34\u6676\u4F5B\u4E0E\u77F3\u4F5B\u3001\u8C61\u6258\u4F5B\u5854\u5747\u4F9D\u6E05\u66FC\u5BFA\u7684\u516C\u5F00\u8BB0\u8F7D\u3002", "correctionTitle": "\u53D1\u73B0\u9519\u8BEF\uFF1F", "correctionText": "\u82E5\u6709\u7EC6\u8282\u6709\u8BEF\uFF0C\u6B22\u8FCE\u6307\u6B63\u3002", "correctionMailto": "mailto:n20186005@gmail.com", "correctionCta": "\u90AE\u4EF6\u7EA0\u9519", "copyright": "\xA9 2026 \u6E05\u66FC\u5BFA\u6307\u5357\u3002\u72EC\u7ACB\u8BBF\u5BA2\u8D44\u6E90\u3002" };
    mapSection = { "label": "\u5730\u56FE\u4E0E\u4F4D\u7F6E", "heading": "\u627E\u5230\u6E05\u66FC\u5BFA", "headingEntity": "\u6E05\u66FC\u5BFA\u7684\u4F4D\u7F6E\u4E0E\u5230\u8BBF\u65B9\u5F0F\uFF08\u6E05\u8FC8\uFF09", "lead": "\u4F4D\u4E8E\u53E4\u57CE\u5317\u9685\u7684\u5B89\u9759\u5730\u5E26\uFF0CRatchapakhinai \u8DEF\u4E0A\uFF0C\u8DDD\u62A4\u57CE\u6CB3\u51E0\u6B65\u4E4B\u9065\u3002", "stats": [{ "tag": "\u8BC4\u5206", "value": "4.7", "sub": "6,192 \u6761\u8BC4\u4EF7" }, { "tag": "\u5F00\u653E", "value": "05:00\u201319:00", "sub": "\u6BCF\u65E5" }, { "tag": "\u521B\u7ACB", "value": "1296", "sub": "\u5B5F\u83B1\u738B" }], "address": "171 Ratchapakhinai Rd, Old City, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand", "plusCode": "QXVQ+GP", "coords": "18.7938, 98.9867" };
    footer = { "brand": { "name": "\u6E05\u66FC\u5BFA", "tagline": "\u6E05\u8FC8\u6700\u53E4\u8001\u7684\u5BFA\u5E99 \xB7 \u5EFA\u4E8E 1296 \u5E74" }, "about": "\u6E05\u66FC\u5BFA\uFF08Wat Chiang Man / \u0E27\u0E31\u0E14\u0E40\u0E0A\u0E35\u0E22\u0E07\u0E21\u0E31\u0E48\u0E19\uFF09\u72EC\u7ACB\u6E38\u89C8\u6307\u5357 \u2014\u2014 \u6E05\u8FC8\u7B2C\u4E00\u5BFA\uFF0C\u7531\u5B5F\u83B1\u738B\u4E8E 1296 \u5E74\u521B\u7ACB\u3002", "navTitle": "\u63A2\u7D22", "navItems": [{ "label": "\u5173\u4E8E", "href": "#about" }, { "label": "\u5EFA\u7B51\u4E0E\u5723\u7269", "href": "#arch" }, { "label": "\u5386\u53F2", "href": "#history" }, { "label": "\u6E38\u89C8\u6307\u5357", "href": "#guide" }, { "label": "\u56FE\u96C6", "href": "#gallery" }, { "label": "\u8BC4\u4EF7", "href": "#reviews" }, { "label": "\u5730\u56FE", "href": "#map" }], "noteTitle": "\u987B\u77E5", "note": "\u514D\u8D39\u5F00\u653E\uFF0C\u6BCF\u65E5 05:00\u201319:00\u3002\u8863\u7740\u7AEF\u5E84\uFF0C\u5165\u6BBF\u8131\u978B\u3002", "mapsLabel": "Google Maps \u2192", "sourcesTitle": "\u6765\u6E90", "sourcesNote": "\u4E8B\u5B9E\u53D6\u81EA\u516C\u5F00\u53C2\u8003\uFF0C\u56FE\u7247\u4E3A\u793A\u610F\u3002", "privacy": "\u9690\u79C1", "terms": "\u6761\u6B3E", "cookies": "Cookie", "verified": { "label": "\u5185\u5BB9\u6838\u5B9E", "text": "\u6838\u5B9E\u4E8E 2026 \u5E74 3 \u6708 \xB7 \u4E8B\u5B9E\u5BA1\u6838\uFF1A\u6CF0\u5317\u5386\u53F2\u6587\u732E\u5E93" }, "disclaimerLead": "\u72EC\u7ACB\u6307\u5357", "unofficial": "\u672C\u7F51\u7AD9\u4E0E\u6E05\u66FC\u5BFA\u6216 Google \u65E0\u96B6\u5C5E\u6216\u80CC\u4E66\u5173\u7CFB\u3002", "dataSource": "\u5730\u56FE\u4E0E\u5730\u70B9\u6570\u636E\uFF1AGoogle Maps\u3002", "copyright": "\xA9 2026 \u6E05\u66FC\u5BFA\u6307\u5357\u3002\u4FDD\u7559\u6240\u6709\u6743\u5229\u3002" };
    legal = { "privacy": { "title": "\u9690\u79C1\u653F\u7B56", "updated": "\u6700\u540E\u66F4\u65B0\uFF1A2026", "sections": [{ "h": "\u6211\u4EEC\u6536\u96C6\u7684\u4FE1\u606F", "p": "\u9664\u975E\u60A8\u8054\u7CFB\u6211\u4EEC\uFF0C\u5426\u5219\u4E0D\u6536\u96C6\u4E2A\u4EBA\u6570\u636E\u3002\u53EF\u80FD\u4F7F\u7528\u533F\u540D\u6C47\u603B\u4F7F\u7528\u7EDF\u8BA1\u6539\u8FDB\u7F51\u7AD9\u3002" }, { "h": "Cookie", "p": "\u5FC5\u8981 Cookie \u7528\u4E8E\u8BB0\u4F4F\u8BED\u8A00\u4E0E\u540C\u610F\u504F\u597D\u3002\u672A\u7ECF\u540C\u610F\u4E0D\u8BBE\u7F6E\u5E7F\u544A\u6216\u8FFD\u8E2A Cookie\u3002" }, { "h": "\u60A8\u7684\u6743\u5229", "p": "\u60A8\u53EF\u8981\u6C42\u5220\u9664\u5206\u4EAB\u7ED9\u6211\u4EEC\u7684\u4EFB\u4F55\u4FE1\u606F\u3002" }] }, "terms": { "title": "\u670D\u52A1\u6761\u6B3E", "updated": "\u6700\u540E\u66F4\u65B0\uFF1A2026", "sections": [{ "h": "\u7F51\u7AD9\u4F7F\u7528", "p": "\u672C\u7F51\u7AD9\u4E3A\u72EC\u7ACB\u6307\u5357\uFF0C\u4EC5\u4F9B\u4E00\u822C\u4FE1\u606F\u3002\u51FA\u884C\u524D\u8BF7\u6838\u5B9E\u5F00\u653E\u65F6\u95F4\u7B49\u7EC6\u8282\u3002" }, { "h": "\u65E0\u96B6\u5C5E", "p": "\u6211\u4EEC\u4E0E\u6E05\u66FC\u5BFA\u6216\u4EFB\u4F55\u5F15\u7528\u670D\u52A1\u65E0\u96B6\u5C5E\u5173\u7CFB\u3002" }, { "h": "\u8D23\u4EFB", "p": "\u4F7F\u7528\u4FE1\u606F\u98CE\u9669\u81EA\u8D1F\uFF0C\u6211\u4EEC\u5BF9\u56E0\u6B64\u4EA7\u751F\u7684\u635F\u5931\u4E0D\u627F\u62C5\u8D23\u4EFB\u3002" }] }, "cookies": { "title": "Cookie \u8BBE\u7F6E", "updated": "\u6700\u540E\u66F4\u65B0\uFF1A2026", "intro": "\u7BA1\u7406\u672C\u7F51\u7AD9\u5982\u4F55\u4F7F\u7528 Cookie\u3002", "categories": [{ "h": "\u5FC5\u8981", "status": "\u59CB\u7EC8\u5F00\u542F", "p": "\u7F51\u7AD9\u8FD0\u884C\u4E0E\u8BB0\u4F4F\u8BED\u8A00\u6240\u5FC5\u9700\u3002", "sub": "", "subStatus": "" }, { "h": "\u504F\u597D", "status": "\u9ED8\u8BA4\u5F00\u542F", "p": "\u8BB0\u4F4F\u60A8\u7684 Cookie \u540C\u610F\u9009\u62E9\u3002", "sub": "", "subStatus": "" }, { "h": "\u7EDF\u8BA1", "status": "\u9ED8\u8BA4\u5173\u95ED", "p": "\u533F\u540D\u6C47\u603B\u7EDF\u8BA1\u4EE5\u6539\u8FDB\u6307\u5357\u3002", "sub": "", "subStatus": "" }], "consent": "\u4FDD\u5B58\u504F\u597D" } };
    zh = {
      meta,
      sync,
      imageCopyright,
      breadcrumb,
      header,
      weather,
      seasons,
      routes,
      itinerary,
      facilities,
      responsibility,
      legends,
      hero,
      about,
      arch,
      history,
      guide,
      food,
      gallery,
      reviews,
      sources,
      mapSection,
      footer,
      legal
    };
    defaultLang = "th";
    messagesMap = { th, en, zh };
    messagesFor = /* @__PURE__ */ __name((lang) => messagesMap[lang] ?? messagesMap[defaultLang], "messagesFor");
  }
});

// dist/_worker.js/chunks/Weather_x2S2SxW0.mjs
var Weather_x2S2SxW0_exports = {};
__export(Weather_x2S2SxW0_exports, {
  default: () => $$Weather,
  file: () => $$file,
  url: () => $$url
});
function codeKey(code) {
  if (code === 0) return "clear";
  if (code === 1) return "mainlyClear";
  if (code === 2) return "partly";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 55) return "drizzle";
  if (code >= 56 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 65) return "rain";
  if (code >= 66 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "showers";
  if (code >= 85 && code <= 86) return "snow";
  if (code === 95) return "storm";
  if (code >= 96) return "storm";
  return "clear";
}
function codeIcon(code, isDay = true) {
  switch (codeKey(code)) {
    case "clear":
      return isDay ? "\u2600" : "\u263E";
    case "mainlyClear":
      return isDay ? "\u{1F324}" : "\u263E";
    case "partly":
      return "\u26C5";
    case "overcast":
      return "\u2601";
    case "fog":
      return "\u{1F32B}";
    case "drizzle":
      return "\u{1F326}";
    case "rain":
      return "\u{1F327}";
    case "showers":
      return "\u{1F327}";
    case "snow":
      return "\u2744";
    case "storm":
      return "\u26C8";
    default:
      return "\u2600";
  }
}
function umbrella(code, precipProb) {
  return RAIN_KEYS.has(codeKey(code)) || precipProb >= 50;
}
function buildUrl() {
  const { latitude, longitude, timezone } = siteConfig.openMeteo;
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max",
    timezone,
    forecast_days: "7"
  });
  return `${API}?${params.toString()}`;
}
function normalize(json) {
  const cur = json?.current;
  const daily = json?.daily;
  if (!cur || !daily?.time?.length) return null;
  const now = {
    temp: Math.round(cur.temperature_2m ?? 0),
    apparent: Math.round(cur.apparent_temperature ?? 0),
    humidity: Math.round(cur.relative_humidity_2m ?? 0),
    wind: Math.round(cur.wind_speed_10m ?? 0),
    code: Number(cur.weather_code ?? 0),
    isDay: cur.is_day === 1 || cur.is_day === true,
    precip: Number(cur.precipitation ?? 0)
  };
  const days = daily.time.map((date, i2) => ({
    date,
    code: Number(daily.weather_code?.[i2] ?? 0),
    tmax: Math.round(daily.temperature_2m_max?.[i2] ?? 0),
    tmin: Math.round(daily.temperature_2m_min?.[i2] ?? 0),
    precipProb: Math.round(daily.precipitation_probability_max?.[i2] ?? 0),
    precipSum: Number(daily.precipitation_sum?.[i2] ?? 0),
    uvMax: Math.round(daily.uv_index_max?.[i2] ?? 0)
  }));
  const today = days[0] ?? null;
  return {
    place: `${siteConfig.name} \xB7 ${siteConfig.address.split(",").slice(-2)[0]?.trim() ?? ""}`,
    timezone: json?.timezone ?? siteConfig.openMeteo.timezone,
    now,
    days,
    today,
    umbrellaToday: today ? umbrella(today.code, today.precipProb) || umbrella(now.code, 0) : umbrella(now.code, 0),
    umbrellaWeek: days.map((d) => umbrella(d.code, d.precipProb)),
    observedAt: cur.time ?? (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function getWeather() {
  const now = Date.now();
  if (memory2 && now - memory2.at < TTL_MS) return memory2.data;
  try {
    const request = new Request(buildUrl(), { method: "GET" });
    const response = await fetch(request, {
      cf: { cacheTtl: 600, cacheEverything: true }
    });
    if (!response.ok) return memory2?.data ?? null;
    const data = normalize(await response.json());
    if (data) memory2 = { at: now, data };
    return data ?? memory2?.data ?? null;
  } catch {
    return memory2?.data ?? null;
  }
}
function windBand(kmh) {
  if (kmh >= 50) return "gale";
  if (kmh >= 29) return "strong";
  if (kmh >= 12) return "breeze";
  return "calm";
}
function humidityBand(h) {
  if (h >= 80) return "muggy";
  if (h >= 65) return "humid";
  if (h >= 40) return "comfy";
  return "dry";
}
function uvBand(uv) {
  if (uv >= 11) return "extreme";
  if (uv >= 8) return "veryHigh";
  if (uv >= 6) return "high";
  if (uv >= 3) return "moderate";
  return "low";
}
function dayTip(day) {
  const key = codeKey(day.code);
  if (key === "storm") return "storm";
  if (RAINY.has(key) && day.precipSum >= 10) return "heavyRain";
  if (RAINY.has(key) || day.precipProb >= 60) return "umbrella";
  if (day.tmax >= 35) return "heat";
  if (day.uvMax >= 8) return "sun";
  if (day.tmax - day.tmin > 8) return "swing";
  if (key === "fog") return "fog";
  return "comfy";
}
function buildAdvice(data) {
  const now = data.now;
  const today = data.today ?? {
    code: now.code,
    tmax: now.temp,
    tmin: now.temp,
    precipProb: 0,
    precipSum: now.precip,
    uvMax: 0
  };
  const nowKey = codeKey(now.code);
  const dayKey = codeKey(today.code);
  const alerts = [];
  const dress = [];
  const plan = [];
  const gear = /* @__PURE__ */ new Set();
  const tmax = today.tmax;
  const tmin = today.tmin;
  const prob = today.precipProb;
  const uv = today.uvMax;
  const swing = tmax - tmin;
  const stormy = nowKey === "storm" || dayKey === "storm";
  const wet = RAINY.has(nowKey) || RAINY.has(dayKey);
  const heavy = !stormy && (today.precipSum >= 10 || now.precip >= 2.5 || today.code === 82 || today.code === 65 || today.code === 67);
  const band = windBand(now.wind);
  if (stormy) {
    alerts.push("storm");
    dress.push({ k: "storm", c: true });
    plan.push({ k: "storm", c: true });
    gear.add("raincoat");
    gear.add("shoesGrip");
  } else if (heavy) {
    alerts.push("heavyRain");
    dress.push({ k: "heavyRain", c: true });
    plan.push({ k: "heavyRain", c: true });
    gear.add("raincoat");
    gear.add("shoesGrip");
  } else if (prob >= 60 || wet && prob >= 40) {
    dress.push({ k: "rainLikely", c: false });
    plan.push({ k: "rainLikely", c: false });
    gear.add("umbrella");
    gear.add("shoesGrip");
  } else if (wet || now.precip > 0 || prob >= 30) {
    dress.push({ k: "lightRain", c: false });
    plan.push({ k: "lightRain", c: false });
    gear.add("foldingUmbrella");
    gear.add("shoesGrip");
  }
  if (tmax >= 38 || now.apparent >= 41) {
    alerts.push("heat");
    dress.push({ k: "heat", c: true });
    plan.push({ k: "heat", c: true });
    gear.add("water");
  } else if (tmax >= 32 || now.temp >= 32) {
    dress.push({ k: "hot", c: false });
    plan.push({ k: "hot", c: false });
    gear.add("water");
  }
  if (uv >= 8) {
    dress.push({ k: "uvExtreme", c: false });
    plan.push({ k: "uv", c: false });
    gear.add("sunscreen");
    gear.add("sunglasses");
    gear.add("hat");
  } else if (uv >= 5) {
    dress.push({ k: "uv", c: false });
    gear.add("sunscreen");
    gear.add("sunglasses");
    gear.add("hat");
  }
  if (tmax <= 10) {
    dress.push({ k: "cold", c: false });
    gear.add("thickCoat");
    gear.add("scarf");
  } else if (swing > 8) {
    dress.push({ k: "swing", c: false });
    gear.add("layer");
  }
  if (band === "gale") {
    alerts.push("wind");
    dress.push({ k: "wind7", c: true });
    plan.push({ k: "wind7", c: true });
    gear.add("windBreaker");
  } else if (band === "strong") {
    dress.push({ k: "wind", c: false });
    plan.push({ k: "wind", c: false });
    gear.add("windBreaker");
  }
  if (!wet && prob < 40) {
    if (nowKey === "clear" || nowKey === "mainlyClear") {
      plan.push({ k: "sunny", c: false });
      gear.add("sunscreen");
    } else if (nowKey === "partly" || nowKey === "overcast") {
      plan.push({ k: "cloudy", c: false });
    }
  }
  if (nowKey === "fog" || dayKey === "fog") {
    alerts.push("fog");
    plan.push({ k: "fog", c: true });
    gear.add("mask");
  }
  if (now.humidity >= 80 && (now.temp >= 28 || tmax >= 32)) {
    plan.push({ k: "muggy", c: false });
    gear.add("water");
  }
  if (tmax >= 30 && !stormy) {
    plan.push({ k: "courtyard", c: false });
    gear.add("slipOn");
    gear.add("socks");
  }
  const risky = alerts.length > 0;
  const lines = /* @__PURE__ */ __name((arr) => {
    if (!arr.length) return ["ok"];
    const kept = risky ? arr.filter((l) => l.c) : arr;
    return (kept.length ? kept : arr.slice(0, 1)).map((l) => l.k);
  }, "lines");
  const gearList = GEAR_ORDER.filter((g) => {
    if (!gear.has(g)) return false;
    if (!risky) return true;
    return CRITICAL_GEAR.has(g) || alerts.includes("heat") && g === "water";
  });
  let best = "any";
  if (stormy || heavy) best = "wait";
  else if (tmax >= 33 || uv >= 8 || prob >= 60) best = "morning";
  return { alerts, dress: lines(dress), plan: lines(plan), gear: gearList, best };
}
var RAIN_KEYS, API, TTL_MS, memory2, RAINY, GEAR_ORDER, CRITICAL_GEAR, $$Astro, $$Weather, $$file, $$url;
var init_Weather_x2S2SxW0 = __esm({
  "dist/_worker.js/chunks/Weather_x2S2SxW0.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_CG2QLMoV();
    init_config_owevsWhQ();
    init_ui_wPxP0zJ8();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(codeKey, "codeKey");
    __name(codeIcon, "codeIcon");
    RAIN_KEYS = /* @__PURE__ */ new Set(["drizzle", "rain", "showers", "storm", "snow"]);
    __name(umbrella, "umbrella");
    API = "https://api.open-meteo.com/v1/forecast";
    TTL_MS = 10 * 60 * 1e3;
    memory2 = null;
    __name(buildUrl, "buildUrl");
    __name(normalize, "normalize");
    __name(getWeather, "getWeather");
    RAINY = /* @__PURE__ */ new Set(["drizzle", "rain", "showers", "storm"]);
    __name(windBand, "windBand");
    __name(humidityBand, "humidityBand");
    __name(uvBand, "uvBand");
    GEAR_ORDER = [
      "umbrella",
      "foldingUmbrella",
      "raincoat",
      "windBreaker",
      "shoesGrip",
      "hat",
      "sunglasses",
      "sunscreen",
      "water",
      "layer",
      "thickCoat",
      "scarf",
      "slipOn",
      "socks",
      "mask"
    ];
    CRITICAL_GEAR = /* @__PURE__ */ new Set(["raincoat", "windBreaker", "shoesGrip", "mask", "thickCoat", "scarf"]);
    __name(dayTip, "dayTip");
    __name(buildAdvice, "buildAdvice");
    $$Astro = createAstro("https://watchiangman.com");
    $$Weather = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
      Astro2.self = $$Weather;
      const { lang } = Astro2.props;
      const w = messagesFor(lang).weather;
      const data = await getWeather();
      const localeMap = { th: "th-TH", en: "en-GB", zh: "zh-CN" };
      const intlLocale = localeMap[lang] ?? "en-GB";
      const weekday = /* @__PURE__ */ __name((iso) => (/* @__PURE__ */ new Date(`${iso}T00:00:00`)).toLocaleDateString(intlLocale, { weekday: "short" }), "weekday");
      const dayNum = /* @__PURE__ */ __name((iso) => (/* @__PURE__ */ new Date(`${iso}T00:00:00`)).toLocaleDateString(intlLocale, { day: "numeric", month: "short" }), "dayNum");
      const observed = data ? new Date(data.observedAt).toLocaleString(intlLocale, {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short"
      }) : "";
      const pick = /* @__PURE__ */ __name((group, key) => w?.advice?.[group]?.[key] ?? key, "pick");
      const level = /* @__PURE__ */ __name((group, key) => w?.levels?.[group]?.[key] ?? key, "level");
      const gearName = /* @__PURE__ */ __name((key) => w?.gear?.[key] ?? key, "gearName");
      const tipName = /* @__PURE__ */ __name((key) => w?.tips?.[key] ?? key, "tipName");
      const condName = /* @__PURE__ */ __name((code) => w?.codes?.[codeKey(code)] ?? w?.codes?.clear ?? "", "condName");
      const advice = data ? buildAdvice(data) : null;
      const humKey = data ? humidityBand(data.now.humidity) : "comfy";
      const uvKey = data ? uvBand(data.today?.uvMax ?? 0) : "low";
      const windKey = data ? windBand(data.now.wind) : "calm";
      const dressList = advice && advice.dress.length ? advice.dress : ["ok"];
      const planList = advice && advice.plan.length ? advice.plan : ["ok"];
      const summary = data ? [
        condName(data.now.code),
        `${data.today?.tmin ?? data.now.temp}\u2013${data.today?.tmax ?? data.now.temp}\xB0`,
        `${w?.uv ?? ""} ${level("uv", uvKey)}`.trim(),
        level("wind", windKey)
      ].filter(Boolean).join(" \xB7 ") : "";
      return renderTemplate`${maybeRenderHead()}<section id="weather" class="py-20 bg-teakDeep text-ivory"> <div class="max-w-7xl mx-auto px-5"> <p class="font-hand text-gold text-xl md:text-2xl">${w.label}</p> <h2 class="font-display font-semibold text-3xl md:text-5xl text-ivory mt-2">${w.heading}</h2> <p class="mt-4 max-w-2xl text-ivory/80">${w.intro}</p> ${data && advice ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": /* @__PURE__ */ __name(async ($$result2) => renderTemplate` <div class="mt-10 grid lg:grid-cols-12 gap-6">  <div class="lg:col-span-5 rounded-2xl border border-gold/25 bg-white/5 p-6"> <div class="flex items-start justify-between gap-4"> <div> <div class="text-xs uppercase tracking-wider text-gold">${w.nowLabel}</div> <div class="font-display text-6xl text-goldBright leading-none mt-2"> ${data.now.temp}°<span class="text-2xl text-ivory/60">C</span> </div> <div class="mt-2 text-ivory/85">${condName(data.now.code)}</div> </div> <div class="text-5xl" aria-hidden="true">${codeIcon(data.now.code, data.now.isDay)}</div> </div> <p class="mt-3 text-sm text-ivory/70">${summary}</p> <dl class="mt-6 grid grid-cols-2 gap-3 text-sm"> <div class="rounded-xl bg-teak/40 px-4 py-3"> <dt class="text-ivory/55 text-xs">${w.feelsLike}</dt> <dd class="font-display text-xl text-ivory">${data.now.apparent}°C</dd> </div> <div class="rounded-xl bg-teak/40 px-4 py-3"> <dt class="text-ivory/55 text-xs">${w.humidityPlain ?? w.humidity}</dt> <dd class="font-display text-xl text-ivory">${level("humidity", humKey)}</dd> <dd class="text-[11px] text-ivory/45">${level("humidityNote", humKey)}</dd> </div> <div class="rounded-xl bg-teak/40 px-4 py-3"> <dt class="text-ivory/55 text-xs">${w.windPlain ?? w.wind}</dt> <dd class="font-display text-xl text-ivory">${level("wind", windKey)}</dd> <dd class="text-[11px] text-ivory/45">${data.now.wind} ${w.windUnit}</dd> </div> <div class="rounded-xl bg-teak/40 px-4 py-3"> <dt class="text-ivory/55 text-xs">${w.rainChance}</dt> <dd class="font-display text-xl text-ivory">${data.today?.precipProb ?? 0}%</dd> </div> </dl>  <div${addAttribute(`mt-5 rounded-xl border px-4 py-3 text-sm ${data.umbrellaToday ? "border-goldBright/50 bg-gold/15 text-gold" : "border-ivory/15 bg-ivory/5 text-ivory/80"}`, "class")}> <span class="font-semibold">${w.umbrellaTitle} </span> ${data.umbrellaToday ? w.umbrellaYes : w.umbrellaNo} </div> <p class="mt-4 text-[11px] text-ivory/45"> ${w.observedLabel} ${observed} · ${w.placeLabel} ${data.place} </p> </div>  <div class="lg:col-span-7 rounded-2xl border border-gold/25 bg-white/5 p-6"> <div class="flex items-baseline justify-between"> <h3 class="font-display text-xl text-goldBright">${w.forecastTitle}</h3> <span class="text-xs text-ivory/50">${w.forecastDays}</span> </div> <ul class="mt-4 divide-y divide-ivory/10"> ${data.days.map((d, i2) => renderTemplate`<li class="grid grid-cols-[3.5rem_2rem_1fr_auto] items-center gap-3 py-3"> <div class="text-sm"> <div class="font-semibold">${i2 === 0 ? w.todayLabel : weekday(d.date)}</div> <div class="text-[11px] text-ivory/45">${dayNum(d.date)}</div> </div> <div class="text-2xl text-center" aria-hidden="true">${codeIcon(d.code)}</div> <div class="text-sm text-ivory/85"> ${condName(d.code)} <span class="ml-2 text-ivory/45">${d.precipProb}%</span> <span class="ml-2 inline-flex items-center rounded-full border border-gold/30 px-2 py-0.5 text-[11px] text-gold"> ${tipName(dayTip(d))} </span> </div> <div class="text-right whitespace-nowrap"> <span class="font-display text-lg text-ivory">${d.tmax}°</span> <span class="text-ivory/45 text-sm"> / ${d.tmin}°</span> </div> </li>`)} </ul> <p class="mt-4 text-[11px] text-ivory/45">${w.forecastNote}</p> </div> </div> <div class="mt-6"> ${advice.alerts.length > 0 ? renderTemplate`<div class="rounded-2xl border border-red-400/50 bg-red-500/10 p-4 md:p-5"> <div class="flex items-center gap-2 text-sm font-semibold text-red-200"> <span aria-hidden="true">⚠️</span> ${w.advice.blocks.alert} </div> <ul class="mt-2 space-y-1 text-sm text-red-100/90"> ${advice.alerts.map((a2) => renderTemplate`<li class="flex gap-2"> <span aria-hidden="true">·</span> <span>${pick("alert", a2)}</span> </li>`)} </ul> </div>` : renderTemplate`<div class="rounded-2xl border border-ivory/15 bg-ivory/5 px-4 py-3 text-sm text-ivory/75"> <span aria-hidden="true">✅</span> ${w.advice.none} </div>`} <div class="mt-4 grid gap-4 md:grid-cols-3"> <div class="rounded-2xl border border-gold/25 bg-white/5 p-5"> <div class="flex items-center gap-2 text-xs uppercase tracking-wider text-gold"> <span aria-hidden="true">👕</span> ${w.advice.blocks.dress} </div> <ul class="mt-3 space-y-2 text-sm text-ivory/85"> ${dressList.map((k) => renderTemplate`<li class="flex gap-2"> <span aria-hidden="true" class="text-gold">›</span> <span>${pick("dress", k)}</span> </li>`)} </ul> </div> <div class="rounded-2xl border border-gold/25 bg-white/5 p-5"> <div class="flex items-center gap-2 text-xs uppercase tracking-wider text-gold"> <span aria-hidden="true">🧭</span> ${w.advice.blocks.plan} </div> <ul class="mt-3 space-y-2 text-sm text-ivory/85"> ${planList.map((k) => renderTemplate`<li class="flex gap-2"> <span aria-hidden="true" class="text-gold">›</span> <span>${pick("plan", k)}</span> </li>`)} </ul> </div> <div class="rounded-2xl border border-gold/25 bg-white/5 p-5"> <div class="flex items-center gap-2 text-xs uppercase tracking-wider text-gold"> <span aria-hidden="true">🎒</span> ${w.advice.blocks.gear} </div> <ul class="mt-3 flex flex-wrap gap-2"> ${advice.gear.map((g) => renderTemplate`<li class="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm text-goldBright"> ${gearName(g)} </li>`)} </ul> </div> </div> <div class="mt-4 rounded-2xl border border-gold/25 bg-white/5 p-5"> <div class="flex items-center gap-2 text-xs uppercase tracking-wider text-gold"> <span aria-hidden="true">🕘</span> ${w.advice.blocks.best} </div> <p class="mt-2 text-sm text-ivory/85">${pick("best", advice.best)}</p> </div> <p class="mt-3 text-[11px] text-ivory/40">${w.advice.auto}</p> </div> `, "default") })}` : renderTemplate`<p class="mt-8 rounded-2xl border border-ivory/15 bg-white/5 p-6 text-sm text-ivory/70"> ${w.unavailable} </p>`} </div> </section>`;
    }, "C:/Users/Administrator/Documents/GitHub/watchiangman/src/components/Weather.astro", void 0);
    $$file = "C:/Users/Administrator/Documents/GitHub/watchiangman/src/components/Weather.astro";
    $$url = void 0;
  }
});

// dist/_worker.js/pages/404.astro.mjs
var astro_exports = {};
var init_astro = __esm({
  "dist/_worker.js/pages/404.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// dist/_worker.js/pages/_lang_/cookie-settings.astro.mjs
var cookie_settings_astro_exports = {};
var init_cookie_settings_astro = __esm({
  "dist/_worker.js/pages/_lang_/cookie-settings.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// dist/_worker.js/pages/_lang_/privacy-policy.astro.mjs
var privacy_policy_astro_exports = {};
var init_privacy_policy_astro = __esm({
  "dist/_worker.js/pages/_lang_/privacy-policy.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// dist/_worker.js/pages/_lang_/terms-of-service.astro.mjs
var terms_of_service_astro_exports = {};
var init_terms_of_service_astro = __esm({
  "dist/_worker.js/pages/_lang_/terms-of-service.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// dist/_worker.js/pages/_lang_.astro.mjs
var lang_astro_exports = {};
var init_lang_astro = __esm({
  "dist/_worker.js/pages/_lang_.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// dist/_worker.js/pages/index.astro.mjs
var index_astro_exports = {};
var init_index_astro = __esm({
  "dist/_worker.js/pages/index.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// dist/_worker.js/noop-entrypoint.mjs
var noop_entrypoint_exports = {};
__export(noop_entrypoint_exports, {
  server: () => server
});
var server;
var init_noop_entrypoint = __esm({
  "dist/_worker.js/noop-entrypoint.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    server = {};
  }
});

// dist/_worker.js/_astro-internal_middleware.mjs
var astro_internal_middleware_exports = {};
__export(astro_internal_middleware_exports, {
  onRequest: () => onRequest
});
var onRequest$2, onRequest$1, onRequest;
var init_astro_internal_middleware = __esm({
  "dist/_worker.js/_astro-internal_middleware.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_render_context_Dfpkc5S();
    init_config_owevsWhQ();
    init_astro_designed_error_pages_qRxMrroR();
    init_server_CG2QLMoV();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    onRequest$2 = defineMiddleware((context, next) => {
      const host = context.url.hostname.toLowerCase();
      const bare = entity.domain.toLowerCase();
      if (host === `www.${bare}`) {
        const target = new URL(context.url);
        target.hostname = bare;
        target.protocol = "https:";
        target.port = "";
        return context.redirect(target.toString(), 301);
      }
      return next();
    });
    onRequest$1 = /* @__PURE__ */ __name((context, next) => {
      if (context.isPrerendered) {
        context.locals.runtime ??= {
          env: process.env
        };
      }
      return next();
    }, "onRequest$1");
    onRequest = sequence(
      onRequest$1,
      onRequest$2
    );
  }
});

// .wrangler/tmp/bundle-gXeENy/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-gXeENy/middleware-insertion-facade.js
init_modules_watch_stub();

// dist/_worker.js/index.js
init_modules_watch_stub();

// dist/_worker.js/renderers.mjs
init_modules_watch_stub();
globalThis.process ??= {};
globalThis.process.env ??= {};
var renderers = [];

// dist/_worker.js/chunks/_@astrojs-ssr-adapter_BXZFdOJ8.mjs
init_modules_watch_stub();
init_render_context_Dfpkc5S();
init_server_CG2QLMoV();

// dist/_worker.js/chunks/noop-middleware_Dt5304Uw.mjs
init_modules_watch_stub();
init_server_CG2QLMoV();
globalThis.process ??= {};
globalThis.process.env ??= {};
var NOOP_MIDDLEWARE_FN = /* @__PURE__ */ __name(async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
}, "NOOP_MIDDLEWARE_FN");

// dist/_worker.js/chunks/_@astrojs-ssr-adapter_BXZFdOJ8.mjs
init_astro_designed_error_pages_qRxMrroR();
import "cloudflare:workers";
globalThis.process ??= {};
globalThis.process.env ??= {};
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
__name(matchPattern, "matchPattern");
function matchPort(url, port) {
  return !port || port === url.port;
}
__name(matchPort, "matchPort");
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
__name(matchProtocol, "matchProtocol");
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) {
      return false;
    }
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
__name(matchHostname, "matchHostname");
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) {
      return false;
    }
    const additionalPathChunks = url.pathname.slice(slicedPathname.length).split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
__name(matchPathname, "matchPathname");
function createI18nMiddleware(i18n, base, trailingSlash, format) {
  if (!i18n) return (_, next) => next();
  const payload = {
    ...i18n,
    trailingSlash,
    base,
    format
  };
  const _redirectToDefaultLocale = redirectToDefaultLocale(payload);
  const _noFoundForNonLocaleRoute = notFound(payload);
  const _requestHasLocale = requestHasLocale(payload.locales);
  const _redirectToFallback = redirectToFallback(payload);
  const prefixAlways = /* @__PURE__ */ __name((context, response) => {
    const url = context.url;
    if (url.pathname === base + "/" || url.pathname === base) {
      return _redirectToDefaultLocale(context);
    } else if (!_requestHasLocale(context)) {
      return _noFoundForNonLocaleRoute(context, response);
    }
    return void 0;
  }, "prefixAlways");
  const prefixOtherLocales = /* @__PURE__ */ __name((context, response) => {
    let pathnameContainsDefaultLocale = false;
    const url = context.url;
    for (const segment of url.pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(i18n.defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = url.pathname.replace(`/${i18n.defaultLocale}`, "");
      response.headers.set("Location", newLocation);
      return _noFoundForNonLocaleRoute(context);
    }
    return void 0;
  }, "prefixOtherLocales");
  return async (context, next) => {
    const response = await next();
    const type = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (type !== "page" && type !== "fallback") {
      return response;
    }
    if (requestIs404Or500(context.request, base)) {
      return response;
    }
    if (isRequestServerIsland(context.request, base)) {
      return response;
    }
    const { currentLocale } = context;
    switch (i18n.strategy) {
      // NOTE: theoretically, we should never hit this code path
      case "manual": {
        return response;
      }
      case "domains-prefix-other-locales": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixOtherLocales(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-other-locales": {
        const result = prefixOtherLocales(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always-no-redirect": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = _noFoundForNonLocaleRoute(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-always-no-redirect": {
        const result = _noFoundForNonLocaleRoute(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "pathname-prefix-always": {
        const result = prefixAlways(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixAlways(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
    }
    return _redirectToFallback(context, response);
  };
}
__name(createI18nMiddleware, "createI18nMiddleware");
function localeHasntDomain(i18n, currentLocale) {
  for (const domainLocale of Object.values(i18n.domainLookupTable)) {
    if (domainLocale === currentLocale) {
      return false;
    }
  }
  return true;
}
__name(localeHasntDomain, "localeHasntDomain");
var dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
var levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
__name(log, "log");
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
__name(isLogLevelEnabled, "isLogLevelEnabled");
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
__name(info, "info");
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
__name(warn, "warn");
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
__name(error, "error");
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
__name(debug, "debug");
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(s.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return s.red(prefix.join(" "));
  }
  if (level === "warn") {
    return s.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return s.dim(prefix[0]);
  }
  return s.dim(prefix[0]) + " " + s.blue(prefix.splice(1).join(" "));
}
__name(getEventPrefix, "getEventPrefix");
var Logger = class {
  static {
    __name(this, "Logger");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
};
var AstroIntegrationLogger = class _AstroIntegrationLogger {
  static {
    __name(this, "AstroIntegrationLogger");
  }
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new _AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
};
var consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.info;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension2.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}
__name(getAssetsPrefix, "getAssetsPrefix");
function createAssetLink(href, base, assetsPrefix, queryParams) {
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(href), assetsPrefix);
    url = joinPaths(pf, slash(href));
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(href)));
  } else {
    url = href;
  }
  return url;
}
__name(createAssetLink, "createAssetLink");
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
__name(createStylesheetElement, "createStylesheetElement");
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s2) => createStylesheetElement(s2, base, assetsPrefix))
  );
}
__name(createStylesheetElementSet, "createStylesheetElementSet");
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
__name(createModuleScriptElement, "createModuleScriptElement");
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
__name(createModuleScriptElementWithSrc, "createModuleScriptElementWithSrc");
var NOOP_ACTIONS_MOD = {
  server: {}
};
var FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
var SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType2 = request.headers.has("content-type");
    if (hasContentType2) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
__name(createOriginCheckMiddleware, "createOriginCheckMiddleware");
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
__name(hasFormLikeHeader, "hasFormLikeHeader");
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.hrefRoot);
  return [
    {
      instance: default404Instance,
      matchesComponent: /* @__PURE__ */ __name((filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href, "matchesComponent"),
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: /* @__PURE__ */ __name((filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href, "matchesComponent"),
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
__name(createDefaultRoutes, "createDefaultRoutes");
var Pipeline = class {
  static {
    __name(this, "Pipeline");
  }
  constructor(logger, manifest2, runtimeMode, renderers2, resolve, serverLike, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2), actions = manifest2.actions) {
    this.logger = logger;
    this.manifest = manifest2;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.serverLike = serverLike;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.internalMiddleware = [];
    if (i18n?.strategy !== "manual") {
      this.internalMiddleware.push(
        createI18nMiddleware(i18n, manifest2.base, manifest2.trailingSlash, manifest2.buildFormat)
      );
    }
  }
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedActions = void 0;
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    } else if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest2 = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      const internalMiddlewares = [onRequest2];
      if (this.manifest.checkOrigin) {
        internalMiddlewares.unshift(createOriginCheckMiddleware());
      }
      this.resolvedMiddleware = sequence(...internalMiddlewares);
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  setActions(actions) {
    this.resolvedActions = actions;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      return await this.actions();
    }
    return NOOP_ACTIONS_MOD;
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server: server2 } = await this.getActions();
    if (!server2 || !(typeof server2 === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server2}.`
      );
    }
    for (const key of pathKeys) {
      if (!(key in server2)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server2 = server2[key];
    }
    if (typeof server2 !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server2}.`
      );
    }
    return server2;
  }
};
var RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
var RedirectSinglePageBuiltModule = {
  page: /* @__PURE__ */ __name(() => Promise.resolve(RedirectComponentInstance), "page"),
  onRequest: /* @__PURE__ */ __name((_, next) => next(), "onRequest"),
  renderers: []
};
function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  return `<!doctype html>
<title>Redirecting to: ${relativeLocation}</title>
<meta http-equiv="refresh" content="${delay};url=${relativeLocation}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${absoluteLocation}">
<body>
	<a href="${relativeLocation}">Redirecting ${from ? `from <code>${from}</code> ` : ""}to <code>${relativeLocation}</code></a>
</body>`;
}
__name(redirectTemplate, "redirectTemplate");
var AppPipeline = class _AppPipeline extends Pipeline {
  static {
    __name(this, "AppPipeline");
  }
  static create({
    logger,
    manifest: manifest2,
    runtimeMode,
    renderers: renderers2,
    resolve,
    serverLike,
    streaming,
    defaultRoutes
  }) {
    const pipeline = new _AppPipeline(
      logger,
      manifest2,
      runtimeMode,
      renderers2,
      resolve,
      serverLike,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      defaultRoutes
    );
    return pipeline;
  }
  headElements(routeData) {
    const routeInfo = this.manifest.routes.find((route) => route.routeData === routeData);
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? []);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r2) => r2.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base,
      outDir: this.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: /* @__PURE__ */ __name(() => Promise.resolve(defaultRoute.instance), "page"),
          renderers: []
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
};
var App = class _App {
  static {
    __name(this, "App");
  }
  #manifest;
  #manifestData;
  #logger = new Logger({
    dest: consoleLogDestination,
    level: "info"
  });
  #baseWithoutTrailingSlash;
  #pipeline;
  #adapterLogger;
  constructor(manifest2, streaming = true) {
    this.#manifest = manifest2;
    this.#manifestData = {
      routes: manifest2.routes.map((route) => route.routeData)
    };
    ensure404Route(this.#manifestData);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#manifest.base);
    this.#pipeline = this.#createPipeline(streaming);
    this.#adapterLogger = new AstroIntegrationLogger(
      this.#logger.options,
      this.#manifest.adapterName
    );
  }
  getAdapterLogger() {
    return this.#adapterLogger;
  }
  getAllowedDomains() {
    return this.#manifest.allowedDomains;
  }
  get manifest() {
    return this.#manifest;
  }
  set manifest(value) {
    this.#manifest = value;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return _App.validateForwardedHost(forwardedHost, this.#manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  /**
   * Validate a hostname by rejecting any with path separators.
   * Prevents path injection attacks. Invalid hostnames return undefined.
   */
  static sanitizeHost(hostname) {
    if (!hostname) return void 0;
    if (/[/\\]/.test(hostname)) return void 0;
    return hostname;
  }
  /**
   * Validate forwarded headers (proto, host, port) against allowedDomains.
   * Returns validated values or undefined for rejected headers.
   * Uses strict defaults: http/https only for proto, rejects port if not in allowedDomains.
   */
  static validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
    const result = {};
    if (forwardedProtocol) {
      if (allowedDomains && allowedDomains.length > 0) {
        const hasProtocolPatterns = allowedDomains.some(
          (pattern) => pattern.protocol !== void 0
        );
        if (hasProtocolPatterns) {
          try {
            const testUrl = new URL(`${forwardedProtocol}://example.com`);
            const isAllowed = allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
            if (isAllowed) {
              result.protocol = forwardedProtocol;
            }
          } catch {
          }
        } else if (/^https?$/.test(forwardedProtocol)) {
          result.protocol = forwardedProtocol;
        }
      } else if (/^https?$/.test(forwardedProtocol)) {
        result.protocol = forwardedProtocol;
      }
    }
    if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
      const hasPortPatterns = allowedDomains.some((pattern) => pattern.port !== void 0);
      if (hasPortPatterns) {
        const isAllowed = allowedDomains.some((pattern) => pattern.port === forwardedPort);
        if (isAllowed) {
          result.port = forwardedPort;
        }
      }
    }
    if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
      const protoForValidation = result.protocol || "https";
      const sanitized = _App.sanitizeHost(forwardedHost);
      if (sanitized) {
        try {
          const hostnameOnly = sanitized.split(":")[0];
          const portFromHost = sanitized.includes(":") ? sanitized.split(":")[1] : void 0;
          const portForValidation = result.port || portFromHost;
          const hostWithPort = portForValidation ? `${hostnameOnly}:${portForValidation}` : hostnameOnly;
          const testUrl = new URL(`${protoForValidation}://${hostWithPort}`);
          const isAllowed = allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
          if (isAllowed) {
            result.host = sanitized;
          }
        } catch {
        }
      }
    }
    return result;
  }
  /**
   * Creates a pipeline by reading the stored manifest
   *
   * @param streaming
   * @private
   */
  #createPipeline(streaming = false) {
    return AppPipeline.create({
      logger: this.#logger,
      manifest: this.#manifest,
      runtimeMode: "production",
      renderers: this.#manifest.renderers,
      defaultRoutes: createDefaultRoutes(this.#manifest),
      resolve: /* @__PURE__ */ __name(async (specifier) => {
        if (!(specifier in this.#manifest.entryModules)) {
          throw new Error(`Unable to resolve [${specifier}]`);
        }
        const bundlePath = this.#manifest.entryModules[specifier];
        if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
          return bundlePath;
        } else {
          return createAssetLink(bundlePath, this.#manifest.base, this.#manifest.assetsPrefix);
        }
      }, "resolve"),
      serverLike: true,
      streaming
    });
  }
  set setManifestData(newManifestData) {
    this.#manifestData = newManifestData;
  }
  removeBase(pathname) {
    if (pathname.startsWith(this.#manifest.base)) {
      return pathname.slice(this.#baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * It removes the base from the request URL, prepends it with a forward slash and attempts to decoded it.
   *
   * If the decoding fails, it logs the error and return the pathname as is.
   * @param request
   * @private
   */
  #getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    try {
      return validateAndDecodePathname(pathname);
    } catch (e2) {
      this.getAdapterLogger().error(e2.toString());
      return pathname;
    }
  }
  /**
   * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
   * routes aren't returned, even if they are matched.
   *
   * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
   * @param request
   * @param allowPrerenderedRoutes
   */
  match(request, allowPrerenderedRoutes = false) {
    const url = new URL(request.url);
    if (this.#manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.#computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    try {
      pathname = validateAndDecodePathname(pathname);
    } catch {
      return void 0;
    }
    let routeData = matchRoute(pathname, this.#manifestData);
    if (!routeData) return void 0;
    if (allowPrerenderedRoutes) {
      return routeData;
    } else if (routeData.prerender) {
      return void 0;
    }
    return routeData;
  }
  #computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.#manifest.i18n && (this.#manifest.i18n.strategy === "domains-prefix-always" || this.#manifest.i18n.strategy === "domains-prefix-other-locales" || this.#manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      const validated = _App.validateForwardedHeaders(
        request.headers.get("X-Forwarded-Proto") ?? void 0,
        request.headers.get("X-Forwarded-Host") ?? void 0,
        request.headers.get("X-Forwarded-Port") ?? void 0,
        this.#manifest.allowedDomains
      );
      let protocol = validated.protocol ? validated.protocol + ":" : url.protocol;
      let host = validated.host ?? request.headers.get("Host");
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.#manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e2) {
          this.#logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.#logger.error("router", `Error: ${e2}`);
        }
      }
    }
    return pathname;
  }
  #redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.#manifest;
    if (pathname === "/" || isInternalPath(pathname)) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
  async render(request, renderOptions) {
    let routeData;
    let locals;
    let clientAddress;
    let addCookieHeader;
    const url = new URL(request.url);
    const redirect = this.#redirectTrailingSlash(url.pathname);
    const prerenderedErrorPageFetch = renderOptions?.prerenderedErrorPageFetch ?? fetch;
    if (redirect !== url.pathname) {
      const status = request.method === "GET" ? 301 : 308;
      return new Response(
        redirectTemplate({
          status,
          relativeLocation: url.pathname,
          absoluteLocation: redirect,
          from: request.url
        }),
        {
          status,
          headers: {
            location: redirect + url.search
          }
        }
      );
    }
    addCookieHeader = renderOptions?.addCookieHeader;
    clientAddress = renderOptions?.clientAddress ?? Reflect.get(request, clientAddressSymbol);
    routeData = renderOptions?.routeData;
    locals = renderOptions?.locals;
    if (routeData) {
      this.#logger.debug(
        "router",
        "The adapter " + this.#manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.#logger.debug("router", "RouteData:\n" + routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        this.#logger.error(null, error2.stack);
        return this.#renderError(request, {
          status: 500,
          error: error2,
          clientAddress,
          prerenderedErrorPageFetch
        });
      }
    }
    if (!routeData) {
      routeData = this.match(request);
      this.#logger.debug("router", "Astro matched the following route for " + request.url);
      this.#logger.debug("router", "RouteData:\n" + routeData);
    }
    if (!routeData) {
      routeData = this.#manifestData.routes.find(
        (route) => route.component === "404.astro" || route.component === DEFAULT_404_COMPONENT
      );
    }
    if (!routeData) {
      this.#logger.debug("router", "Astro hasn't found routes that match " + request.url);
      this.#logger.debug("router", "Here's the available routes:\n", this.#manifestData);
      return this.#renderError(request, {
        locals,
        status: 404,
        clientAddress,
        prerenderedErrorPageFetch
      });
    }
    const pathname = this.#getPathnameFromRequest(request);
    const defaultStatus = this.#getDefaultStatusCode(routeData, pathname);
    let response;
    let session;
    try {
      const mod = await this.#pipeline.getModuleForRoute(routeData);
      if (!mod || typeof mod.page !== "function") {
        throw new AstroError({
          ...FailedToFindPageMapSSR,
          message: `The module for route "${routeData.route}" does not have a valid page function. This may occur when using static output mode with an SSR adapter.`
        });
      }
      const renderContext = await RenderContext.create({
        pipeline: this.#pipeline,
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus,
        clientAddress
      });
      session = renderContext.session;
      response = await renderContext.render(await mod.page());
    } catch (err) {
      this.#logger.error("router", "Error while trying to render the route " + routeData.route);
      this.#logger.error(null, err.stack || err.message || String(err));
      return this.#renderError(request, {
        locals,
        status: 500,
        error: err,
        clientAddress,
        prerenderedErrorPageFetch
      });
    } finally {
      await session?.[PERSIST_SYMBOL]();
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
    // but uses the current route to handle the 404
    response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#renderError(request, {
        locals,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0,
        clientAddress,
        prerenderedErrorPageFetch
      });
    }
    if (response.headers.has(REROUTE_DIRECTIVE_HEADER)) {
      response.headers.delete(REROUTE_DIRECTIVE_HEADER);
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of _App.getSetCookieFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes
   */
  async #renderError(request, {
    locals,
    status,
    response: originalResponse,
    skipMiddleware = false,
    error: error2,
    clientAddress,
    prerenderedErrorPageFetch
  }) {
    const errorRoutePath = `/${status}${this.#manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, this.#manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(
          `${this.#baseWithoutTrailingSlash}/${status}${maybeDotHtml}`,
          url
        );
        if (statusURL.toString() !== request.url) {
          const response2 = await prerenderedErrorPageFetch(statusURL.toString());
          const override = { status, removeContentEncodingHeaders: true };
          return this.#mergeResponses(response2, originalResponse, override);
        }
      }
      const mod = await this.#pipeline.getModuleForRoute(errorRouteData);
      if (!mod || typeof mod.page !== "function") {
        const response2 = this.#mergeResponses(new Response(null, { status }), originalResponse);
        Reflect.set(response2, responseSentSymbol, true);
        return response2;
      }
      let session;
      try {
        const renderContext = await RenderContext.create({
          locals,
          pipeline: this.#pipeline,
          middleware: skipMiddleware ? NOOP_MIDDLEWARE_FN : void 0,
          pathname: this.#getPathnameFromRequest(request),
          request,
          routeData: errorRouteData,
          status,
          props: { error: error2 },
          clientAddress
        });
        session = renderContext.session;
        const response2 = await renderContext.render(await mod.page());
        return this.#mergeResponses(response2, originalResponse);
      } catch {
        if (skipMiddleware === false) {
          return this.#renderError(request, {
            locals,
            status,
            response: originalResponse,
            skipMiddleware: true,
            clientAddress,
            prerenderedErrorPageFetch
          });
        }
      } finally {
        await session?.[PERSIST_SYMBOL]();
      }
    }
    const response = this.#mergeResponses(new Response(null, { status }), originalResponse);
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  #mergeResponses(newResponse, originalResponse, override) {
    let newResponseHeaders = newResponse.headers;
    if (override?.removeContentEncodingHeaders) {
      newResponseHeaders = new Headers(newResponseHeaders);
      newResponseHeaders.delete("Content-Encoding");
      newResponseHeaders.delete("Content-Length");
    }
    if (!originalResponse) {
      if (override !== void 0) {
        return new Response(newResponse.body, {
          status: override.status,
          statusText: newResponse.statusText,
          headers: newResponseHeaders
        });
      }
      return newResponse;
    }
    const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
    try {
      originalResponse.headers.delete("Content-type");
    } catch {
    }
    const mergedHeaders = new Map([
      ...Array.from(newResponseHeaders),
      ...Array.from(originalResponse.headers)
    ]);
    const newHeaders = new Headers();
    for (const [name, value] of mergedHeaders) {
      newHeaders.set(name, value);
    }
    return new Response(newResponse.body, {
      status,
      statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
      // If you're looking at here for possible bugs, it means that it's not a bug.
      // With the middleware, users can meddle with headers, and we should pass to the 404/500.
      // If users see something weird, it's because they are setting some headers they should not.
      //
      // Although, we don't want it to replace the content-type, because the error page must return `text/html`
      headers: newHeaders
    });
  }
  #getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
};
async function handle(manifest2, app, request, env, context) {
  const { pathname } = new URL(request.url);
  const bindingName = "SESSION";
  globalThis.__env__ ??= {};
  globalThis.__env__[bindingName] = env[bindingName];
  if (manifest2.assets.has(pathname)) {
    return env.ASSETS.fetch(request.url.replace(/\.html$/, ""));
  }
  const routeData = app.match(request);
  if (!routeData) {
    const asset = await env.ASSETS.fetch(
      request.url.replace(/index.html$/, "").replace(/\.html$/, "")
    );
    if (asset.status !== 404) {
      return asset;
    }
  }
  Reflect.set(request, /* @__PURE__ */ Symbol.for("astro.clientAddress"), request.headers.get("cf-connecting-ip"));
  process.env.ASTRO_STUDIO_APP_TOKEN ??= (() => {
    if (typeof env.ASTRO_STUDIO_APP_TOKEN === "string") {
      return env.ASTRO_STUDIO_APP_TOKEN;
    }
  })();
  const locals = {
    runtime: {
      env,
      cf: request.cf,
      caches,
      ctx: {
        waitUntil: /* @__PURE__ */ __name((promise) => context.waitUntil(promise), "waitUntil"),
        // Currently not available: https://developers.cloudflare.com/pages/platform/known-issues/#pages-functions
        passThroughOnException: /* @__PURE__ */ __name(() => {
          throw new Error(
            "`passThroughOnException` is currently not available in Cloudflare Pages. See https://developers.cloudflare.com/pages/platform/known-issues/#pages-functions."
          );
        }, "passThroughOnException"),
        props: {}
      }
    }
  };
  const response = await app.render(
    request,
    {
      routeData,
      locals,
      prerenderedErrorPageFetch: /* @__PURE__ */ __name(async (url) => {
        return env.ASSETS.fetch(url.replace(/\.html$/, ""));
      }, "prerenderedErrorPageFetch")
    }
  );
  if (app.setCookieHeaders) {
    for (const setCookieHeader of app.setCookieHeaders(response)) {
      response.headers.append("Set-Cookie", setCookieHeader);
    }
  }
  return response;
}
__name(handle, "handle");
function createExports(manifest2) {
  const app = new App(manifest2);
  const fetch2 = /* @__PURE__ */ __name(async (request, env, context) => {
    return await handle(manifest2, app, request, env, context);
  }, "fetch");
  return { default: { fetch: fetch2 } };
}
__name(createExports, "createExports");
var serverEntrypointModule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createExports
}, Symbol.toStringTag, { value: "Module" }));

// dist/_worker.js/manifest_DzBdgb0j.mjs
init_modules_watch_stub();
init_server_CG2QLMoV();
init_astro_designed_error_pages_qRxMrroR();
globalThis.process ??= {};
globalThis.process.env ??= {};
function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
__name(sanitizeParams, "sanitizeParams");
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
__name(getParameter, "getParameter");
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
__name(getSegment, "getSegment");
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}
__name(getRouteGenerator, "getRouteGenerator");
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}
__name(deserializeRouteData, "deserializeRouteData");
function deserializeManifest(serializedManifest) {
  const routes2 = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes2.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes: routes2,
    serverIslandNameMap,
    key
  };
}
__name(deserializeManifest, "deserializeManifest");
var manifest = deserializeManifest({ "hrefRoot": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/", "cacheDir": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/node_modules/.astro/", "outDir": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/dist/", "srcDir": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/src/", "publicDir": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/public/", "buildClientDir": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/dist/", "buildServerDir": "file:///C:/Users/Administrator/Documents/GitHub/watchiangman/dist/_worker.js/", "adapterName": "@astrojs/cloudflare", "routes": [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "404.html", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/404", "isIndex": false, "type": "page", "pattern": "^\\/404\\/?$", "segments": [[{ "content": "404", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/404.astro", "pathname": "/404", "prerender": true, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "index.html", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": true, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "index.html", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "fallback", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": true, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }], "site": "https://watchiangman.com", "base": "/", "trailingSlash": "ignore", "compressHTML": true, "componentMetadata": [["C:/Users/Administrator/Documents/GitHub/watchiangman/src/pages/404.astro", { "propagation": "none", "containsHead": true }], ["C:/Users/Administrator/Documents/GitHub/watchiangman/src/pages/[lang]/index.astro", { "propagation": "in-tree", "containsHead": true }], ["\0@astro-page:src/pages/[lang]/index@_@astro", { "propagation": "in-tree", "containsHead": false }], ["\0@astrojs-ssr-virtual-entry", { "propagation": "in-tree", "containsHead": false }], ["C:/Users/Administrator/Documents/GitHub/watchiangman/src/pages/[lang]/cookie-settings.astro", { "propagation": "none", "containsHead": true }], ["C:/Users/Administrator/Documents/GitHub/watchiangman/src/pages/[lang]/privacy-policy.astro", { "propagation": "none", "containsHead": true }], ["C:/Users/Administrator/Documents/GitHub/watchiangman/src/pages/[lang]/terms-of-service.astro", { "propagation": "none", "containsHead": true }]], "renderers": [], "clientDirectives": [["idle", '(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener("change",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();']], "entryModules": { "\0@astro-page:src/pages/404@_@astro": "pages/404.astro.mjs", "\0@astro-page:src/pages/[lang]/cookie-settings@_@astro": "pages/_lang_/cookie-settings.astro.mjs", "\0@astro-page:src/pages/[lang]/index@_@astro": "pages/_lang_.astro.mjs", "\0@astro-page:src/pages/[lang]/privacy-policy@_@astro": "pages/_lang_/privacy-policy.astro.mjs", "\0@astro-page:src/pages/[lang]/terms-of-service@_@astro": "pages/_lang_/terms-of-service.astro.mjs", "\0@astro-page:src/pages/index@_@astro": "pages/index.astro.mjs", "\0@astrojs-ssr-virtual-entry": "index.js", "\0@astro-renderers": "renderers.mjs", "\0astro-internal:middleware": "_astro-internal_middleware.mjs", "\0virtual:astro:actions/noop-entrypoint": "noop-entrypoint.mjs", "\0@astrojs-ssr-adapter": "_@astrojs-ssr-adapter.mjs", "\0@astrojs-manifest": "manifest_DzBdgb0j.mjs", "C:/Users/Administrator/Documents/GitHub/watchiangman/src/components/Weather.astro": "chunks/Weather_x2S2SxW0.mjs", "C:/Users/Administrator/Documents/GitHub/watchiangman/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs": "chunks/cloudflare-kv-binding_DMly_2Gl.mjs", "C:/Users/Administrator/Documents/GitHub/watchiangman/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts": "_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js", "C:/Users/Administrator/Documents/GitHub/watchiangman/src/components/Header.astro?astro&type=script&index=0&lang.ts": "_astro/Header.astro_astro_type_script_index_0_lang.oNUwXOWT.js", "astro:scripts/before-hydration.js": "" }, "inlinedScripts": [["C:/Users/Administrator/Documents/GitHub/watchiangman/src/components/Header.astro?astro&type=script&index=0&lang.ts", 'const e=document.getElementById("menu-btn"),n=document.getElementById("mobile-menu");e?.addEventListener("click",()=>{n?.classList.toggle("hidden")});']], "assets": ["/_astro/cookie-settings.Clq5PJ_P.css", "/manifest.webmanifest", "/robots.txt", "/sitemap.xml", "/sw.js", "/_headers", "/_redirects", "/gallery/wat-chiang-man-chiang-mai-1.jpg", "/gallery/wat-chiang-man-chiang-mai-1.webp", "/gallery/wat-chiang-man-chiang-mai-10.jpg", "/gallery/wat-chiang-man-chiang-mai-10.webp", "/gallery/wat-chiang-man-chiang-mai-11.jpg", "/gallery/wat-chiang-man-chiang-mai-11.webp", "/gallery/wat-chiang-man-chiang-mai-12.jpg", "/gallery/wat-chiang-man-chiang-mai-12.webp", "/gallery/wat-chiang-man-chiang-mai-13.jpg", "/gallery/wat-chiang-man-chiang-mai-13.webp", "/gallery/wat-chiang-man-chiang-mai-14.jpg", "/gallery/wat-chiang-man-chiang-mai-14.webp", "/gallery/wat-chiang-man-chiang-mai-15.jpg", "/gallery/wat-chiang-man-chiang-mai-15.webp", "/gallery/wat-chiang-man-chiang-mai-16.jpg", "/gallery/wat-chiang-man-chiang-mai-16.webp", "/gallery/wat-chiang-man-chiang-mai-17.jpg", "/gallery/wat-chiang-man-chiang-mai-17.webp", "/gallery/wat-chiang-man-chiang-mai-18.jpg", "/gallery/wat-chiang-man-chiang-mai-18.webp", "/gallery/wat-chiang-man-chiang-mai-19.jpg", "/gallery/wat-chiang-man-chiang-mai-19.webp", "/gallery/wat-chiang-man-chiang-mai-2.jpg", "/gallery/wat-chiang-man-chiang-mai-2.webp", "/gallery/wat-chiang-man-chiang-mai-20.jpg", "/gallery/wat-chiang-man-chiang-mai-20.webp", "/gallery/wat-chiang-man-chiang-mai-21.jpg", "/gallery/wat-chiang-man-chiang-mai-21.webp", "/gallery/wat-chiang-man-chiang-mai-22.jpg", "/gallery/wat-chiang-man-chiang-mai-22.webp", "/gallery/wat-chiang-man-chiang-mai-23.jpg", "/gallery/wat-chiang-man-chiang-mai-23.webp", "/gallery/wat-chiang-man-chiang-mai-3.jpg", "/gallery/wat-chiang-man-chiang-mai-3.webp", "/gallery/wat-chiang-man-chiang-mai-4.jpg", "/gallery/wat-chiang-man-chiang-mai-4.webp", "/gallery/wat-chiang-man-chiang-mai-5.jpg", "/gallery/wat-chiang-man-chiang-mai-5.webp", "/gallery/wat-chiang-man-chiang-mai-6.jpg", "/gallery/wat-chiang-man-chiang-mai-6.webp", "/gallery/wat-chiang-man-chiang-mai-7.jpg", "/gallery/wat-chiang-man-chiang-mai-7.webp", "/gallery/wat-chiang-man-chiang-mai-8.jpg", "/gallery/wat-chiang-man-chiang-mai-8.webp", "/gallery/wat-chiang-man-chiang-mai-9.jpg", "/gallery/wat-chiang-man-chiang-mai-9.webp", "/icons/icon-maskable.svg", "/icons/icon.svg", "/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js", "/_worker.js/index.js", "/_worker.js/noop-entrypoint.mjs", "/_worker.js/renderers.mjs", "/_worker.js/_@astrojs-ssr-adapter.mjs", "/_worker.js/_astro-internal_middleware.mjs", "/_worker.js/chunks/astro-designed-error-pages_qRxMrroR.mjs", "/_worker.js/chunks/astro_BQgOOXpY.mjs", "/_worker.js/chunks/BaseLayout_D1IGDpkY.mjs", "/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs", "/_worker.js/chunks/config_owevsWhQ.mjs", "/_worker.js/chunks/noop-middleware_Dt5304Uw.mjs", "/_worker.js/chunks/render-context_Dfpkc5S_.mjs", "/_worker.js/chunks/ui_wPxP0zJ8.mjs", "/_worker.js/chunks/Weather_x2S2SxW0.mjs", "/_worker.js/chunks/_@astrojs-ssr-adapter_BXZFdOJ8.mjs", "/_worker.js/pages/404.astro.mjs", "/_worker.js/pages/index.astro.mjs", "/_worker.js/pages/_lang_.astro.mjs", "/_worker.js/_astro/cookie-settings.Clq5PJ_P.css", "/_worker.js/chunks/astro/server_CG2QLMoV.mjs", "/_worker.js/pages/_lang_/cookie-settings.astro.mjs", "/_worker.js/pages/_lang_/privacy-policy.astro.mjs", "/_worker.js/pages/_lang_/terms-of-service.astro.mjs", "/404.html", "/index.html", "/index.html"], "i18n": { "fallbackType": "redirect", "strategy": "pathname-prefix-always", "locales": ["th", "en", "zh"], "defaultLocale": "th", "domainLookupTable": {} }, "buildFormat": "directory", "checkOrigin": true, "allowedDomains": [], "actionBodySizeLimit": 1048576, "serverIslandNameMap": [["C:/Users/Administrator/Documents/GitHub/watchiangman/src/components/Weather.astro", "Weather"]], "key": "+dfJPgJlNaGhQbadWhIFnZUCCnkfQ0eIxHMBQOrZ+vM=", "sessionConfig": { "driver": "cloudflare-kv-binding", "options": { "binding": "SESSION" } } });
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => Promise.resolve().then(() => (init_cloudflare_kv_binding_DMly_2Gl(), cloudflare_kv_binding_DMly_2Gl_exports));

// dist/_worker.js/index.js
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map([
  ["Weather", () => Promise.resolve().then(() => (init_Weather_x2S2SxW0(), Weather_x2S2SxW0_exports))]
]);
var _page0 = /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_astro(), astro_exports)), "_page0");
var _page1 = /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_cookie_settings_astro(), cookie_settings_astro_exports)), "_page1");
var _page2 = /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_privacy_policy_astro(), privacy_policy_astro_exports)), "_page2");
var _page3 = /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_terms_of_service_astro(), terms_of_service_astro_exports)), "_page3");
var _page4 = /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_lang_astro(), lang_astro_exports)), "_page4");
var _page5 = /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_index_astro(), index_astro_exports)), "_page5");
var pageMap = /* @__PURE__ */ new Map([
  ["src/pages/404.astro", _page0],
  ["src/pages/[lang]/cookie-settings.astro", _page1],
  ["src/pages/[lang]/privacy-policy.astro", _page2],
  ["src/pages/[lang]/terms-of-service.astro", _page3],
  ["src/pages/[lang]/index.astro", _page4],
  ["src/pages/index.astro", _page5]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_noop_entrypoint(), noop_entrypoint_exports)), "actions"),
  middleware: /* @__PURE__ */ __name(() => Promise.resolve().then(() => (init_astro_internal_middleware(), astro_internal_middleware_exports)), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error2 = reduceError(e2);
    const body = JSON.stringify(error2);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-gXeENy/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = __astrojsSsrVirtualEntry;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-gXeENy/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default,
  pageMap
};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*! https://mths.be/cssesc v3.0.0 by @mathias */
//# sourceMappingURL=index.js.map
