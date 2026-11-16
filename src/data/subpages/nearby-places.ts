import type { SubPage } from './types';

type NearbySlug = 'three-kings-monument' | 'wat-chedi-luang' | 'wat-phra-singh';
type NearbySet = Record<NearbySlug, SubPage>;

const destinations = {
  kings: { name: 'Three Kings Monument', address: 'QXRP+3WX, Prapokklao Road, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Three+Kings+Monument+Chiang+Mai+Thailand', image: '/gallery/nearby-three-kings-monument.jpg', alt: 'Three bronze kings at Three Kings Monument in Chiang Mai' },
  chedi: { name: 'Wat Chedi Luang', address: '103 Prapokkloa Road, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Chedi+Luang+Chiang+Mai+Thailand', image: '/gallery/nearby-wat-chedi-luang.jpg', alt: 'Large historic brick stupa at Wat Chedi Luang Chiang Mai' },
  singh: { name: 'Wat Phra Singh', address: '2 Samlarn Road, Phra Sing, Mueang Chiang Mai District, Chiang Mai 50200, Thailand', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Phra+Singh+Chiang+Mai+Thailand', image: '/gallery/nearby-wat-phra-singh.jpg', alt: 'Gilded stupa at Wat Phra Singh in Chiang Mai' },
} as const;

export const nearbyEn: NearbySet = {
  'three-kings-monument': {
    slug: 'three-kings-monument', nav: 'Three Kings Monument', title: 'Three Kings Monument Chiang Mai: History & Visit Guide', description: 'Explore Three Kings Monument near Wat Chiang Man: location, city-founding history, photography, nearby museums and a walking route.', label: 'Old City landmark', heading: 'Three Kings Monument: Chiang Mai’s founding story and civic square',
    lead: 'A short walk south-west of Wat Chiang Man, this central square honours Mangrai, Ramkhamhaeng and Ngam Mueang. The bronze monument introduces the alliance remembered in Chiang Mai’s founding traditions and is a natural stop between the Old City’s temples and museums.',
    destination: destinations.kings, photos: [{ src: destinations.kings.image, alt: destinations.kings.alt }], management: { heading: 'About Three Kings Monument and its management', body: 'Three Kings Monument stands in a public civic square of Chiang Mai. Public-space upkeep and event arrangements are associated with local civic authorities; adjacent museums are operated separately. This is a memorial and community meeting place rather than a ticketed temple. Check local notices for temporary event restrictions.' },
    quickFacts: [{ label: 'Attraction', value: 'Outdoor civic monument' }, { label: 'Address', value: destinations.kings.address }, { label: 'Visit time', value: '20–40 minutes (museum visits extra)' }],
    sections: [
      { h: 'Historical background: three rulers and a new capital', p: 'Local tradition links King Mangrai with King Ramkhamhaeng of Sukhothai and King Ngam Mueang of Phayao. The monument commemorates their alliance and the political setting in which Chiang Mai grew into the Lanna capital. The narrative is a historical tradition, not a transcript of a single documented meeting.' },
      { h: 'Sculpture and architectural setting', p: 'Three standing bronze figures form the focal point, with a ceremonial forecourt and an old civic building behind them. The contrast between royal sculpture and civic architecture makes this a useful place to read the city’s public memory.', bullets: ['Look at the three figures as a group before photographing individual gestures.', 'Step back to include the building façade and open plaza.', 'Observe how offerings and local commemorations change the square’s atmosphere.'] },
      { h: 'Opening hours and admission', p: 'The open-air square can usually be viewed without a ticket. Access may change for events. Museums around the square have their own admission charges and opening hours: check those separately on the day.' },
      { h: 'How to get here from Wat Chiang Man', p: 'Walk south-west through the Old City streets toward Prapokkloa Road. Allow roughly 10–15 minutes depending on crossings and your chosen route. Use this page’s monument-specific Google Maps link.', bullets: ['Start at Wat Chiang Man on Ratchapakhinai Road.', 'Follow the pedestrian directions to Three Kings Monument, not a generic Chiang Mai map pin.', 'Continue south to Wat Chedi Luang or west to Wat Phra Singh.'] },
      { h: 'Suggested route, photography and etiquette', p: 'Visit early in the day for a quieter foreground. A simple route is Wat Chiang Man → Three Kings Monument → Wat Chedi Luang. Photograph from the edge of the plaza, keep access clear and do not climb the memorial.', bullets: ['Wide photo: three statues plus the building behind.', 'Detail photo: bronze surface and ceremonial offerings, without disturbing them.', 'Shaded pause: read nearby museum information before continuing.'] },
      { h: 'Accommodation and nearby options', p: 'Old City guesthouses around the central and northern lanes are convenient for walking between these stops. Choose accommodation based on actual walking access, noise levels and current prices rather than the monument itself.' },
    ], faqs: [{ q: 'Is Three Kings Monument close to Wat Chiang Man?', a: 'Yes, it is within the Old City and is a convenient short walk south-west.' }, { q: 'Is there a ticket for the monument?', a: 'The outdoor square generally has no ticket; surrounding museums have separate policies.' }, { q: 'What should I photograph?', a: 'The bronze figures with the historic building behind them make the clearest establishing shot.' }],
  },
  'wat-chedi-luang': {
    slug: 'wat-chedi-luang', nav: 'Wat Chedi Luang', title: 'Wat Chedi Luang Chiang Mai: Stupa, History & Visit Tips', description: 'A detailed Wat Chedi Luang guide: immense Lanna chedi, temple history, address, dress code, photo viewpoints and routes from Wat Chiang Man.', label: 'Lanna heritage', heading: 'Wat Chedi Luang: the monumental brick stupa of Chiang Mai',
    lead: 'Wat Chedi Luang occupies a prominent position in Chiang Mai Old City. Its massive, weathered brick chedi contrasts with the smaller elephant-supported stupa at Wat Chiang Man, revealing how temple architecture expressed changing royal ambition.',
    destination: destinations.chedi, photos: [{ src: destinations.chedi.image, alt: destinations.chedi.alt }], management: { heading: 'About Wat Chedi Luang and its custodians', body: 'Wat Chedi Luang is a functioning Buddhist monastery. Its monastic community administers religious activities and visitor access, while conservation of the historic structures involves relevant heritage and temple authorities. Visitors should respect current access notices, as worship and preservation take priority over sightseeing.' },
    quickFacts: [{ label: 'Attraction', value: 'Historic Buddhist temple and brick chedi' }, { label: 'Address', value: destinations.chedi.address }, { label: 'Suggested visit', value: '45–75 minutes' }],
    sections: [
      { h: 'History: a major Lanna royal monument', p: 'The great chedi developed during the Lanna kingdom and was enlarged over time. Earthquake damage and centuries of weathering shaped its present silhouette. Repairs and conservation are visible layers of the story rather than evidence that the whole monument survives unchanged.' },
      { h: 'Architecture: scale, brickwork and naga stairways', p: 'The chedi’s broad terraces, tall recessed niches and decorated stair approaches create an imposing geometric composition. Visitors can compare the mass of this brick monument with Wat Chiang Man’s stucco elephant base.', bullets: ['Stand far enough back to include the entire surviving chedi.', 'Notice the stairways and mythical naga details from permitted paths.', 'Look at changes in brick colour and repaired surfaces.'] },
      { h: 'Opening hours, entrance and dress', p: 'Opening times and visitor charges can change; check the current board at the temple entrance. Cover shoulders and knees, remove shoes where required and keep a respectful distance from worshippers.' },
      { h: 'Getting here and a half-day itinerary', p: 'From Three Kings Monument continue south through the Old City; from Wat Chiang Man allow time for a longer walk and crossings. A practical sequence is Wat Chiang Man → Three Kings Monument → Wat Chedi Luang → Wat Phra Singh.', bullets: ['Use the destination-specific Google Maps link at the top of this page.', 'Carry water and plan shade breaks in the hottest hours.', 'Allow extra time if ceremonies restrict the usual visitor path.'] },
      { h: 'Photo viewpoints and visitor notes', p: 'Take a frontal wide shot from an accessible courtyard path, then look for diagonal light revealing the brick texture. Do not climb the structure or enter closed restoration areas. Avoid flash photography inside active prayer halls.' },
      { h: 'Stay nearby', p: 'The central Old City has a range of small hotels and guesthouses within walking reach of the temple cluster. For a quiet stay, compare accommodation on side streets with options directly on busy thoroughfares.' },
    ], faqs: [{ q: 'What makes Wat Chedi Luang famous?', a: 'Its enormous historic brick chedi is among the signature structures of Chiang Mai Old City.' }, { q: 'Can I walk there from Wat Chiang Man?', a: 'Yes. Both are within the moat, and the walk can include Three Kings Monument.' }, { q: 'Is the entry fee the same as Wat Chiang Man?', a: 'Do not assume so; check Wat Chedi Luang’s current posted admission arrangements.' }],
  },
  'wat-phra-singh': {
    slug: 'wat-phra-singh', nav: 'Wat Phra Singh', title: 'Wat Phra Singh Chiang Mai: Lanna Art & Visitor Guide', description: 'Visit Wat Phra Singh: ornate Lanna halls, gilded chedi, location, walking route from Wat Chiang Man, photographs and temple etiquette.', label: 'Old City temple', heading: 'Wat Phra Singh: ornate Lanna halls and a gilded chedi',
    lead: 'Wat Phra Singh is one of the Old City’s most important Buddhist temple complexes. The decorated viharns, carved wooden details and gilded stupa offer a rich comparison with the earlier Wat Chiang Man complex.',
    destination: destinations.singh, photos: [{ src: destinations.singh.image, alt: destinations.singh.alt }], management: { heading: 'About Wat Phra Singh and its custodians', body: 'Wat Phra Singh is an active monastery managed in its daily religious life by its monastic community. Temple administrators and relevant heritage bodies support the care of its buildings and devotional works. Visitor circulation may change for festivals, ceremonies or preservation work.' },
    quickFacts: [{ label: 'Attraction', value: 'Lanna Buddhist temple complex' }, { label: 'Address', value: destinations.singh.address }, { label: 'Suggested visit', value: '45–75 minutes' }],
    sections: [
      { h: 'History and religious importance', p: 'The complex developed under Lanna royal patronage and became strongly associated with the revered Phra Singh Buddha image. Its role as a living worship centre continues alongside its importance for Chiang Mai cultural heritage.' },
      { h: 'Architecture: viharn, timber carving and chedi', p: 'Look for sweeping tiered roofs, carved gables, decorative naga motifs and the shining golden chedi. These details reward a slower visit because different halls reflect restoration and artistic choices from different periods.', bullets: ['Compare the proportions and rooflines of the main viharn and smaller halls.', 'Observe painted and carved decorative patterns without touching them.', 'Photograph the chedi from a respectful distance to show its surrounding buildings.'] },
      { h: 'Admission, opening and visitor manners', p: 'Check the current entrance signs for hours, any visitor charges and hall access. Dress modestly, remove shoes at hall entrances and avoid blocking worshippers or using flash near religious images.' },
      { h: 'How to reach Wat Phra Singh', p: 'From Wat Chiang Man, walk west and south through the Old City, optionally via Three Kings Monument. The journey is suitable for a temple-focused half-day, but allow extra time for heat and street crossings.', bullets: ['The Google Maps button above searches specifically for Wat Phra Singh.', 'Consider visiting after Wat Chedi Luang to make a gentle westward loop.', 'If tired, use local transport rather than rushing in midday heat.'] },
      { h: 'Photo spots and a short walking sequence', p: 'Start with a broad courtyard composition, move toward a carved viharn façade, then finish with the chedi. Early morning or late-afternoon light is often gentler on gilded surfaces.', bullets: ['Wide view: roofline and forecourt.', 'Detail view: woodwork and decorative gables.', 'Context view: chedi with adjacent halls and greenery.'] },
      { h: 'Accommodation choices', p: 'Western Old City accommodation suits visitors who want to walk to Wat Phra Singh, cafés and other temples. Compare current rates, access and evening noise before booking.' },
    ], faqs: [{ q: 'How far is Wat Phra Singh from Wat Chiang Man?', a: 'Both are inside Chiang Mai Old City and can be combined on a walking route; exact time depends on your path and stops.' }, { q: 'What is the main architectural highlight?', a: 'The ornate Lanna viharns and gilded chedi are especially photogenic.' }, { q: 'Can I take pictures inside?', a: 'Follow each hall’s signs and ask when unsure; do not disturb ceremonies or use flash around devotional objects.' }],
  },
};

export const nearbyZh: NearbySet = {
  'three-kings-monument': {
    ...nearbyEn['three-kings-monument'], nav: '三王纪念碑', title: '清迈三王纪念碑：历史、地址与古城步行攻略', description: '了解清迈三王纪念碑的建城传说、铜像特色、广场、拍照位置与从清曼寺出发的步行路线。', label: '古城历史地标', heading: '三王纪念碑：清迈建城故事与城市广场',
    lead: '从清曼寺向西南步行不远便可抵达三王纪念碑。铜像纪念孟莱王、兰甘亨王与南蒙王，是认识清迈建城传统及古城公共空间的好起点。',
    management: { heading: '关于三王纪念碑及管理主体', body: '三王纪念碑位于清迈市中心公共广场，广场的日常公共空间维护与活动安排涉及地方市政管理单位，周边博物馆则有各自的运营机制。这里既是纪念性雕塑，也是本地居民使用的公共空间；活动期间请遵守现场安排。' },
    quickFacts: [{ label: '景点类型', value: '户外历史纪念碑' }, { label: '具体地址', value: destinations.kings.address }, { label: '建议停留', value: '20–40分钟；博物馆另计' }],
    sections: [
      { h: '历史背景：三位国王与清迈建城', p: '兰纳传统将孟莱王与素可泰的兰甘亨王、帕尧的南蒙王联系在一起。纪念碑象征他们的联盟及清迈建城的政治背景；具体情节应理解为历史记忆与传说交织的叙述。' },
      { h: '铜像与建筑环境', p: '三尊站立的铜像位于广场中央，背后是具有历史氛围的公共建筑。雕像与城市建筑的组合是最值得观察的特色。', bullets: ['先从广场边缘拍下三位国王的整体构图。', '把背后的建筑立面纳入照片，体现地点特色。', '留意市民献花与纪念活动，不打扰现场。'] },
      { h: '门票与开放时间', p: '户外广场通常无需门票即可观看；举办活动时可能限制部分区域。周边博物馆的开放时间和费用与广场不同，应分别现场核实。' },
      { h: '从清曼寺步行前往', p: '沿古城街道向西南方向走至 Prapokkloa 路，依过街情况约需10–15分钟。请使用页面顶部的三王纪念碑专属地图。', bullets: ['从 Ratchapakhinai 路的清曼寺入口出发。', '按 Google Maps 行人路线前往三王纪念碑。', '之后可向南前往契迪龙寺，或向西走向帕辛寺。'] },
      { h: '推荐路线与拍摄机位', p: '清曼寺 → 三王纪念碑 → 契迪龙寺很适合半日古城游。清晨广场较易拍摄空旷画面；请勿攀爬纪念碑或阻挡行人。', bullets: ['广角机位：铜像与后方建筑。', '细节机位：雕塑表面和供花，勿触碰。', '休息点：广场边缘，顺便查看附近博物馆展览。'] },
      { h: '住宿与附近选择', p: '古城中北部的小型旅馆适合步行游览这一片区。订房时建议按真实步行距离、夜间噪声与当期价格作选择。' },
    ], faqs: [{ q: '三王纪念碑离清曼寺近吗？', a: '很近，两者均在清迈古城内，可轻松串联步行游览。' }, { q: '广场需要买门票吗？', a: '户外广场一般免费；周围博物馆有各自的收费安排。' }, { q: '最佳拍照位置在哪里？', a: '站在广场边缘，将三尊铜像与后方建筑一起收入镜头。' }],
  },
  'wat-chedi-luang': {
    ...nearbyEn['wat-chedi-luang'], nav: '契迪龙寺', title: '清迈契迪龙寺：大佛塔历史、建筑、门票与交通', description: '契迪龙寺专题攻略：兰纳砖塔、建筑细节、具体地址、从清曼寺步行路线、参观须知和摄影机位。', label: '兰纳历史遗产', heading: '契迪龙寺：清迈古城宏伟的砖砌佛塔',
    lead: '契迪龙寺位于清迈古城核心区域，巨大的残存砖塔与清曼寺尺度较小的象托佛塔形成鲜明对比，能直观感受兰纳寺院建筑的发展。',
    management: { heading: '关于契迪龙寺及管理主体', body: '契迪龙寺是仍在运作的佛教寺院，日常宗教活动及游客进入安排由寺方僧团管理，古建筑保护还涉及相关文化遗产与寺院维护单位。参观时以寺方公告与文物保护要求为先。' },
    quickFacts: [{ label: '景点类型', value: '佛教寺院及历史砖塔' }, { label: '具体地址', value: destinations.chedi.address }, { label: '建议停留', value: '45–75分钟' }],
    sections: [
      { h: '历史背景：兰纳王室的重要佛塔', p: '巨型佛塔建于兰纳王国时期，并曾经历扩建。地震破坏、风雨侵蚀与后期保护工程共同形成今日可见的外形。' },
      { h: '建筑特色：巨大砖塔与蛇神阶梯', p: '佛塔宽阔的层级、壁龛及装饰性阶梯呈现出宏伟的几何结构。可以与清曼寺的大象灰泥塔基对比。', bullets: ['从庭院远处完整观察佛塔轮廓。', '沿允许的路线欣赏阶梯和那伽蛇神装饰。', '注意砖色差异与修缮痕迹。'] },
      { h: '开放时间、门票及着装', p: '开放时间和游客收费可能变化，以寺院入口公告为准。需遮肩盖膝，在指定殿堂脱鞋，并保持礼佛空间安静。' },
      { h: '交通与半日游览顺序', p: '从三王纪念碑向南步行即可到达。推荐清曼寺 → 三王纪念碑 → 契迪龙寺 → 帕辛寺的顺路游览方式。', bullets: ['使用顶部契迪龙寺独立 Google 地图导航。', '炎热时段准备饮水并安排阴凉休息。', '若法会影响参观路线，应遵从现场引导。'] },
      { h: '摄影机位与游览须知', p: '在庭院步道拍摄正面广角，再利用侧光观察砖块纹理。禁止攀爬古塔或进入封闭修缮区，殿堂内避免闪光灯。' },
      { h: '附近住宿建议', p: '清迈古城中心有多种旅馆和民宿，适合步行串联寺院。建议比较安静小巷与繁忙主路的住宿环境。' },
    ], faqs: [{ q: '契迪龙寺最有名的是什么？', a: '最突出的地标是体量宏大的历史砖砌佛塔。' }, { q: '能从清曼寺走过去吗？', a: '可以，两寺都在古城护城河内，途中还可经过三王纪念碑。' }, { q: '门票与清曼寺一样免费吗？', a: '不要直接套用清曼寺的免费政策，应以契迪龙寺现场公告为准。' }],
  },
  'wat-phra-singh': {
    ...nearbyEn['wat-phra-singh'], nav: '帕辛寺', title: '清迈帕辛寺：兰纳建筑、金塔、地址与参观指南', description: '帕辛寺深度指南：佛殿木雕、金色佛塔、交通地图、清曼寺步行线路、摄影位置与参拜礼仪。', label: '古城重要寺院', heading: '帕辛寺：精美的兰纳佛殿与金色佛塔',
    lead: '帕辛寺是清迈古城重要的佛教寺院群。精美的佛殿、木雕与金色佛塔值得和历史更早的清曼寺一起参观，比较不同年代的兰纳风格。',
    management: { heading: '关于帕辛寺及管理主体', body: '帕辛寺是一座有持续宗教活动的佛教寺院，日常宗教事务由寺方僧团管理，寺院行政人员及相关文物保护单位协助维护建筑与宗教艺术品。遇到节庆、法会或修缮时，游客路线可能调整。' },
    quickFacts: [{ label: '景点类型', value: '兰纳佛教寺院群' }, { label: '具体地址', value: destinations.singh.address }, { label: '建议停留', value: '45–75分钟' }],
    sections: [
      { h: '历史与宗教意义', p: '寺院在兰纳王室支持下逐渐发展，与深受信众尊崇的帕辛佛像密切相关。今日仍是重要的礼佛场所，也体现清迈传统文化。' },
      { h: '建筑特色：佛殿、木雕与金塔', p: '层叠屋顶、雕花山墙、那伽装饰和金色佛塔是核心看点。不同建筑的修建与修复年代不尽相同，适合放慢脚步观察。', bullets: ['比较大型佛殿与小型殿堂的屋顶比例。', '欣赏木雕和彩绘纹样，但不要触摸。', '从适当距离拍摄金塔与周围建筑。'] },
      { h: '门票、开放时间与参拜礼仪', p: '请在入口核实最新开放时间、收费和殿堂进入规定。遮肩盖膝，入殿脱鞋，不打扰礼佛者，避免闪光灯。' },
      { h: '从清曼寺如何抵达', p: '从清曼寺穿行古城向西南方向走，可以经三王纪念碑抵达。炎热天气与街口过街时间会影响全程。', bullets: ['顶部地图按钮专门搜索帕辛寺。', '可先游契迪龙寺，再向西完成半日路线。', '中午酷热时可改用当地交通工具。'] },
      { h: '拍照位置与短路线', p: '先在庭院拍摄佛殿全景，再观察木雕山墙，最后以金色佛塔结束。晨光或傍晚较适合拍摄金色建筑。', bullets: ['广角：佛殿屋顶和前方广场。', '细节：木雕山墙及装饰。', '环境：金塔与周边殿堂、绿植。'] },
      { h: '住宿建议', p: '古城西侧适合想步行参访帕辛寺及周边咖啡馆的旅客。预订前比较实际房价、交通便利性与夜间噪声。' },
    ], faqs: [{ q: '帕辛寺离清曼寺远吗？', a: '都位于清迈古城内，适合串联步行；实际时间取决于路线及中途停留。' }, { q: '最值得看的建筑是什么？', a: '精美的兰纳佛殿、木雕和金色佛塔都值得重点观察。' }, { q: '室内可以拍照吗？', a: '依各殿堂标识执行，不干扰法会，不在佛像附近使用闪光灯。' }],
  },
};

export const nearbyTh: NearbySet = {
  'three-kings-monument': {
    ...nearbyEn['three-kings-monument'], nav: 'อนุสาวรีย์สามกษัตริย์', title: 'อนุสาวรีย์สามกษัตริย์ เชียงใหม่: ประวัติและวิธีเที่ยว', description: 'รู้จักอนุสาวรีย์สามกษัตริย์ ประวัติการสร้างเมือง จุดถ่ายภาพ แผนที่เฉพาะจุด และเส้นทางเดินจากวัดเชียงมั่น', label: 'จุดประวัติศาสตร์เมืองเก่า', heading: 'อนุสาวรีย์สามกษัตริย์: เรื่องราวการสร้างเมืองเชียงใหม่',
    lead: 'จากวัดเชียงมั่นเดินไปทางตะวันตกเฉียงใต้ไม่นานก็ถึงลานอนุสาวรีย์สามกษัตริย์ รูปหล่อสำริดรำลึกถึงพญามังราย พ่อขุนรามคำแหง และพญางำเมือง ซึ่งเกี่ยวข้องกับตำนานการสร้างเมืองเชียงใหม่',
    management: { heading: 'เกี่ยวกับอนุสาวรีย์และผู้ดูแล', body: 'อนุสาวรีย์สามกษัตริย์ตั้งอยู่ในลานสาธารณะกลางเมืองเชียงใหม่ การดูแลพื้นที่และการจัดกิจกรรมเกี่ยวข้องกับหน่วยงานท้องถิ่น ส่วนพิพิธภัณฑ์รอบบริเวณมีการบริหารแยกกัน ลานนี้เป็นทั้งสถานที่รำลึกและพื้นที่ชุมชน ควรปฏิบัติตามประกาศเมื่อมีงานพิเศษ' },
    quickFacts: [{ label: 'ประเภท', value: 'อนุสาวรีย์กลางแจ้ง' }, { label: 'ที่อยู่', value: destinations.kings.address }, { label: 'เวลาชม', value: '20–40 นาที ไม่รวมพิพิธภัณฑ์' }],
    sections: [
      { h: 'ประวัติศาสตร์สามกษัตริย์', p: 'ความทรงจำท้องถิ่นเชื่อมโยงพญามังรายกับพ่อขุนรามคำแหงแห่งสุโขทัยและพญางำเมืองแห่งพะเยา อนุสาวรีย์สื่อถึงพันธมิตรและบริบทการก่อตั้งเชียงใหม่ โดยเรื่องเล่ามีทั้งประวัติศาสตร์และตำนาน' },
      { h: 'ประติมากรรมและอาคารโดยรอบ', p: 'รูปหล่อสามพระองค์ตั้งเด่นหน้าสถาปัตยกรรมอาคารราชการเก่า เหมาะสำหรับสังเกตความสัมพันธ์ระหว่างศิลปะอนุสรณ์กับพื้นที่สาธารณะ', bullets: ['ถ่ายภาพทั้งสามพระองค์จากขอบลาน', 'รวมอาคารด้านหลังเพื่อบอกบริบทสถานที่', 'เคารพผู้มาถวายดอกไม้หรือร่วมพิธี'] },
      { h: 'เวลาเปิดและค่าเข้าชม', p: 'ลานกลางแจ้งโดยทั่วไปชมได้โดยไม่ต้องซื้อตั๋ว แต่อาจมีการจำกัดพื้นที่ระหว่างงาน พิพิธภัณฑ์รอบลานมีเวลาและค่าเข้าชมแยกต่างหาก ควรตรวจสอบหน้างาน' },
      { h: 'เดินทางจากวัดเชียงมั่น', p: 'เดินไปทางตะวันตกเฉียงใต้สู่ถนนพระปกเกล้า ใช้เวลาประมาณ 10–15 นาทีตามทางข้ามถนน และใช้ปุ่ม Google Maps เฉพาะอนุสาวรีย์บนหน้านี้', bullets: ['เริ่มจากทางเข้าวัดเชียงมั่นบนถนนราชภาคินัย', 'เลือกเส้นทางเดินไปอนุสาวรีย์สามกษัตริย์', 'จากนั้นเดินใต้สู่วัดเจดีย์หลวงหรือไปตะวันตกสู่วัดพระสิงห์'] },
      { h: 'แผนเที่ยวและจุดถ่ายภาพ', p: 'แนะนำวัดเชียงมั่น → อนุสาวรีย์สามกษัตริย์ → วัดเจดีย์หลวง ช่วงเช้าถ่ายภาพได้สบายขึ้น ไม่ปีนรูปหล่อหรือกีดขวางทางเดิน', bullets: ['มุมกว้าง: รูปหล่อพร้อมอาคาร', 'มุมใกล้: รายละเอียดสำริดและเครื่องสักการะโดยไม่แตะต้อง', 'พักบริเวณริมลานก่อนเข้าพิพิธภัณฑ์'] },
      { h: 'ที่พักและสถานที่ใกล้เคียง', p: 'เกสต์เฮาส์ในตรอกเมืองเก่าตอนเหนือและตอนกลางเหมาะกับการเดินชมหลายจุด ควรเปรียบเทียบระยะเดินจริง ราคา และความเงียบสงบก่อนจอง' },
    ], faqs: [{ q: 'อนุสาวรีย์สามกษัตริย์ใกล้วัดเชียงมั่นไหม?', a: 'ใกล้กันและอยู่ภายในคูเมือง สามารถเดินต่อกันได้สะดวก' }, { q: 'ต้องซื้อตั๋วเข้าลานหรือไม่?', a: 'ลานกลางแจ้งโดยทั่วไปเข้าชมฟรี ส่วนพิพิธภัณฑ์แยกค่าเข้าชม' }, { q: 'ถ่ายภาพมุมไหนดี?', a: 'ถ่ายจากขอบลานให้เห็นรูปหล่อสามพระองค์และอาคารด้านหลัง' }],
  },
  'wat-chedi-luang': {
    ...nearbyEn['wat-chedi-luang'], nav: 'วัดเจดีย์หลวง', title: 'วัดเจดีย์หลวง เชียงใหม่: ประวัติ เจดีย์ และการเดินทาง', description: 'คู่มือวัดเจดีย์หลวง ประวัติเจดีย์อิฐล้านนา ที่อยู่ แผนที่ จุดถ่ายภาพ การแต่งกาย และเส้นทางจากวัดเชียงมั่น', label: 'มรดกล้านนา', heading: 'วัดเจดีย์หลวง: เจดีย์อิฐขนาดใหญ่แห่งเมืองเก่าเชียงใหม่',
    lead: 'วัดเจดีย์หลวงมีเจดีย์อิฐเก่าแก่ขนาดมหึมา ตั้งอยู่ใจกลางเมืองเก่า และช่วยให้เห็นความต่างระหว่างสถาปัตยกรรมเจดีย์ยุคต่าง ๆ เมื่อเทียบกับเจดีย์ช้างล้อมของวัดเชียงมั่น',
    management: { heading: 'เกี่ยวกับวัดเจดีย์หลวงและผู้ดูแล', body: 'วัดเจดีย์หลวงเป็นพระอารามที่ยังมีศาสนกิจ คณะสงฆ์ดูแลการใช้พื้นที่และการเข้าชม ขณะที่การอนุรักษ์โบราณสถานเกี่ยวข้องกับหน่วยงานด้านมรดกและการดูแลวัด ผู้เยี่ยมชมควรปฏิบัติตามป้ายและข้อจำกัดของพื้นที่' },
    quickFacts: [{ label: 'ประเภท', value: 'วัดพุทธและเจดีย์อิฐประวัติศาสตร์' }, { label: 'ที่อยู่', value: destinations.chedi.address }, { label: 'เวลาชม', value: '45–75 นาที' }],
    sections: [
      { h: 'ประวัติเจดีย์สำคัญแห่งล้านนา', p: 'เจดีย์ใหญ่สร้างและขยายในสมัยอาณาจักรล้านนา ผ่านความเสียหายจากแผ่นดินไหวและการผุกร่อน รูปทรงปัจจุบันจึงสะท้อนทั้งประวัติการสร้างและการอนุรักษ์' },
      { h: 'สถาปัตยกรรมอิฐและบันไดนาค', p: 'ฐานกว้าง ระเบียงหลายชั้น ซุ้มสูง และบันไดตกแต่งให้เจดีย์ดูยิ่งใหญ่ ต่างจากฐานช้างปูนปั้นของวัดเชียงมั่น', bullets: ['ถอยมองรูปทรงจากลานที่อนุญาต', 'ชมลวดลายนาคและซุ้มจากทางเดิน', 'สังเกตสีอิฐและร่องรอยการซ่อมแซม'] },
      { h: 'เวลาเปิด ค่าเข้า และการแต่งกาย', p: 'เวลาเปิดและค่าเข้าชมอาจเปลี่ยน ให้ดูประกาศที่ประตูวัด แต่งกายปิดไหล่และเข่า ถอดรองเท้าตามป้าย และให้ความสำคัญกับผู้ประกอบศาสนกิจ' },
      { h: 'การเดินทางและเส้นทางครึ่งวัน', p: 'จากอนุสาวรีย์สามกษัตริย์เดินลงใต้ แนะนำเส้นทางวัดเชียงมั่น → อนุสาวรีย์สามกษัตริย์ → วัดเจดีย์หลวง → วัดพระสิงห์', bullets: ['ใช้ Google Maps เฉพาะวัดเจดีย์หลวงที่ด้านบน', 'เตรียมน้ำและพักร่มช่วงอากาศร้อน', 'ปรับแผนเมื่อมีพิธีหรือพื้นที่ปิด'] },
      { h: 'มุมถ่ายภาพและข้อควรรู้', p: 'เริ่มจากภาพเจดีย์เต็มองค์ในลาน แล้วใช้แสงด้านข้างสังเกตผิวอิฐ ห้ามปีนเจดีย์หรือเข้าเขตบูรณะ และงดแฟลชในวิหารที่กำลังประกอบพิธี' },
      { h: 'ที่พักใกล้เคียง', p: 'ย่านกลางเมืองเก่ามีโรงแรมเล็กและเกสต์เฮาส์หลายแบบ ควรดูราคา ความสะดวกในการเดิน และความเงียบของถนนก่อนเลือก' },
    ], faqs: [{ q: 'วัดเจดีย์หลวงเด่นเรื่องใด?', a: 'เจดีย์อิฐขนาดมหึมาเป็นสัญลักษณ์เด่นของวัดและเมืองเก่าเชียงใหม่' }, { q: 'เดินจากวัดเชียงมั่นได้หรือไม่?', a: 'ได้ อยู่ภายในคูเมืองและสามารถแวะอนุสาวรีย์สามกษัตริย์ระหว่างทาง' }, { q: 'เข้าฟรีเหมือนวัดเชียงมั่นหรือไม่?', a: 'ควรตรวจสอบอัตราค่าเข้าชมของวัดเจดีย์หลวงที่หน้างานโดยตรง' }],
  },
  'wat-phra-singh': {
    ...nearbyEn['wat-phra-singh'], nav: 'วัดพระสิงห์', title: 'วัดพระสิงห์ เชียงใหม่: วิหารล้านนา เจดีย์ และแผนที่', description: 'เที่ยววัดพระสิงห์ ชมวิหารแกะสลักและเจดีย์สีทอง พร้อมที่อยู่ แผนที่ เส้นทางเดินจากวัดเชียงมั่น และมุมถ่ายภาพ', label: 'วัดสำคัญในเมืองเก่า', heading: 'วัดพระสิงห์: วิหารล้านนาอันวิจิตรและเจดีย์สีทอง',
    lead: 'วัดพระสิงห์เป็นพระอารามสำคัญของเชียงใหม่ มีวิหารตกแต่งอย่างประณีต งานแกะสลักไม้ และเจดีย์สีทอง เหมาะกับการเที่ยวเปรียบเทียบสถาปัตยกรรมล้านนากับวัดเชียงมั่น',
    management: { heading: 'เกี่ยวกับวัดพระสิงห์และผู้ดูแล', body: 'วัดพระสิงห์เป็นวัดที่ยังประกอบศาสนกิจ คณะสงฆ์ดูแลกิจกรรมทางศาสนาและการใช้พื้นที่ โดยมีผู้ดูแลวัดและหน่วยงานที่เกี่ยวข้องร่วมอนุรักษ์อาคารและศิลปกรรม การเข้าอาคารอาจเปลี่ยนเมื่อมีงานบุญหรือบูรณะ' },
    quickFacts: [{ label: 'ประเภท', value: 'กลุ่มวัดพุทธศิลปะล้านนา' }, { label: 'ที่อยู่', value: destinations.singh.address }, { label: 'เวลาชม', value: '45–75 นาที' }],
    sections: [
      { h: 'ประวัติศาสตร์และความสำคัญทางศาสนา', p: 'วัดพัฒนาภายใต้การอุปถัมภ์ของกษัตริย์ล้านนาและเกี่ยวข้องกับพระพุทธสิหิงค์ที่ได้รับความเคารพนับถือ ปัจจุบันยังเป็นศูนย์กลางศรัทธาและมรดกวัฒนธรรมเชียงใหม่' },
      { h: 'สถาปัตยกรรมวิหาร งานไม้ และเจดีย์', p: 'หลังคาลดชั้น หน้าบันแกะสลัก ลวดลายนาค และเจดีย์ทองเป็นจุดเด่น อาคารต่าง ๆ ผ่านการสร้างและซ่อมแซมหลายยุค', bullets: ['เปรียบเทียบสัดส่วนหลังคาวิหารแต่ละหลัง', 'ชมงานไม้โดยไม่สัมผัสลวดลาย', 'ถ่ายเจดีย์จากระยะที่เห็นบริบทรอบข้าง'] },
      { h: 'เวลาเปิด ค่าเข้า และมารยาท', p: 'ตรวจสอบป้ายทางเข้าวัดสำหรับเวลา ค่าเข้าชม และการเข้าวิหาร แต่งกายสุภาพ ถอดรองเท้า และหลีกเลี่ยงแฟลชหรือการรบกวนผู้สวดมนต์' },
      { h: 'การเดินทางจากวัดเชียงมั่น', p: 'เดินผ่านเมืองเก่าไปทางตะวันตกเฉียงใต้ อาจแวะอนุสาวรีย์สามกษัตริย์ก่อน เผื่อเวลาสำหรับแดดและจุดข้ามถนน', bullets: ['ปุ่มแผนที่ด้านบนค้นหาวัดพระสิงห์โดยตรง', 'อาจเที่ยววัดเจดีย์หลวงก่อน แล้วเดินต่อมาทางตะวันตก', 'ช่วงอากาศร้อนเลือกใช้รถท้องถิ่นได้'] },
      { h: 'มุมถ่ายภาพและลำดับการชม', p: 'เริ่มภาพกว้างวิหาร สังเกตงานไม้ แล้วจบที่เจดีย์สีทอง แสงเช้าหรือช่วงบ่ายแก่เหมาะกับรายละเอียดอาคาร', bullets: ['ภาพกว้าง: หน้าวิหารและลาน', 'ภาพใกล้: หน้าบันและงานแกะสลัก', 'ภาพบรรยากาศ: เจดีย์กับอาคารและต้นไม้'] },
      { h: 'การเลือกที่พัก', p: 'ที่พักฝั่งตะวันตกของเมืองเก่าสะดวกสำหรับเดินไปวัดพระสิงห์และร้านกาแฟ ควรตรวจสอบราคาปัจจุบัน การเดินทาง และเสียงรบกวนยามค่ำ' },
    ], faqs: [{ q: 'วัดพระสิงห์ไกลจากวัดเชียงมั่นไหม?', a: 'ทั้งสองวัดอยู่ในเมืองเก่า สามารถเดินเที่ยวต่อกันได้ ระยะเวลาขึ้นกับเส้นทางและจุดแวะ' }, { q: 'สถาปัตยกรรมเด่นคืออะไร?', a: 'วิหารล้านนาที่ตกแต่งอย่างประณีตและเจดีย์สีทอง' }, { q: 'ถ่ายรูปในวิหารได้ไหม?', a: 'ดูป้ายแต่ละวิหาร ไม่รบกวนพิธีและหลีกเลี่ยงแฟลชใกล้พระพุทธรูป' }],
  },
};
