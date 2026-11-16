import type { SubPage } from './types';

type NewSlug = 'entrance-fee-and-hours' | 'lanna-architecture' | 'old-city-walking-route';
type NewPages = Record<NewSlug, SubPage>;

export const extraEn: NewPages = {
  'entrance-fee-and-hours': {
    slug: 'entrance-fee-and-hours', nav: 'Entry fee & opening hours',
    title: 'Wat Chiang Man Entrance Fee & Hours | 2026 Visit Tips',
    description: 'Is Wat Chiang Man free? Check entry, visiting hours, dress code, address and a practical 30–60 minute plan before visiting Chiang Mai Old City.',
    label: 'Plan your visit', heading: 'Wat Chiang Man entrance fee, opening hours and practical details',
    lead: 'Wat Chiang Man is an active Buddhist monastery in the northern part of Chiang Mai Old City. Plan your visit around the quiet courtyard, the elephant-supported chedi and the prayer halls; individual buildings may be closed during religious activities.',
    quickFacts: [{ label: 'Admission', value: 'Free; donations optional' }, { label: 'Hours shown on this guide', value: 'Daily 05:00–19:00; check locally' }, { label: 'Address', value: '171 Ratchapakhinai Road, Si Phum, Chiang Mai 50200' }],
    sections: [
      { h: 'Is there an entrance fee?', p: 'General entry to the temple grounds is free. You do not need to buy a ticket to see the courtyard or the distinctive Chedi Chang Lom. Donations and devotional offerings are separate and voluntary.', bullets: ['Carry small Thai-baht notes if you wish to donate.', 'No ticket reservation is needed for an ordinary independent visit.', 'If a particular ceremony or room has a separate arrangement, follow the notices at the entrance rather than assuming access.'] },
      { h: 'What time does Wat Chiang Man open?', p: 'This guide currently lists 05:00–19:00 daily. Published third-party hours differ, and hall access may be shorter than the courtyard hours. Confirm at the entrance on the day, especially around Buddhist holidays.', bullets: ['Morning: cooler temperatures and a quieter atmosphere for respectful observation.', 'Midday: bring water, sun protection and allow time to rest in the shade.', 'Late afternoon: soft light on the elephant chedi; do not rely on last-minute access to interiors.'] },
      { h: 'What to wear and bring', p: 'Wat Chiang Man is a place of worship. Wear clothing that covers shoulders and knees, take shoes off where signs request it and keep voices low around worshippers.', bullets: ['Bring water and comfortable walking shoes for the Old City streets.', 'Photograph the exterior without climbing the sculptures or interrupting prayer.', 'Ask before photographing monks or visitors taking part in a ceremony.'] },
      { h: 'A realistic 30–60 minute visit', p: 'Begin at the main entrance on Ratchapakhinai Road, walk to the elephant-supported chedi, then look at the surrounding viharns and ordination hall from permitted areas.', bullets: ['First 10 minutes: read the setting and identify the chedi.', 'Next 15–25 minutes: examine Lanna roof details and look for the revered Buddha images where viewing is permitted.', 'Final 10–20 minutes: pause in the courtyard, photograph respectfully and continue towards Three Kings Monument.'] },
      { h: 'Location, management and accessibility', p: 'Address: 171 Ratchapakhinai Rd, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand. The working monastery manages daily religious access; rules can change with temple activities.', bullets: ['The site is inside the Old City moat, so walking or a short local ride is often simpler than finding parking.', 'Paths include uneven paving and raised hall thresholds; ask on-site about step-free alternatives.', 'Use the dedicated Google Maps link above to navigate to Wat Chiang Man, not to a generic city-centre pin.'] },
    ],
    faqs: [
      { q: 'How much is the entrance fee at Wat Chiang Man?', a: 'General admission is free; donations are welcome but optional.' },
      { q: 'Is Wat Chiang Man open every day?', a: 'The guide lists daily visiting hours of 05:00–19:00. Access to individual halls and actual hours should be checked on-site.' },
      { q: 'How long should I spend here?', a: 'Allow roughly 30–60 minutes for the chedi, halls and courtyard; longer if you enjoy architectural details.' },
      { q: 'Can I visit in shorts?', a: 'Choose clothing that covers knees and shoulders, especially when entering a worship hall.' },
    ],
  },
  'lanna-architecture': {
    slug: 'lanna-architecture', nav: 'Lanna architecture & Buddha images',
    title: 'Wat Chiang Man Architecture: Elephant Chedi & Buddhas',
    description: 'Explore Chedi Chang Lom, Lanna roof architecture, Phra Sila and the crystal Buddha at Wat Chiang Man, with an easy on-site observation route.',
    label: 'History in stone and timber', heading: 'Wat Chiang Man architecture: what to look for and why it matters',
    lead: 'Founded in the early history of Chiang Mai under King Mangrai, Wat Chiang Man preserves a layered architectural story. Look for the contrast between the weight of the elephant-supported chedi, the tiered timber roofs and the small, revered images kept within the temple complex.',
    quickFacts: [{ label: 'Key landmark', value: 'Chedi Chang Lom (elephant-supported stupa)' }, { label: 'Tradition', value: 'Lanna Buddhist architecture' }, { label: 'Visit length', value: 'About 45–60 minutes' }],
    sections: [
      { h: 'About Wat Chiang Man and its custodians', p: 'Wat Chiang Man is an active Buddhist temple, cared for through its monastic community and temple support network. It should be understood as an ongoing religious place rather than a museum or a single preserved building. Repairs and additions across the centuries make its mixed architectural layers part of its significance.' },
      { h: 'Chedi Chang Lom: the elephant-supported base', p: 'The chedi is the most recognisable element of the compound. Stucco elephant forms emerge from its base and visually support the upper stupa. The design links Buddhist monument-building with Lanna ideas of power, guardianship and permanence.', bullets: ['Stand back to see the relationship between the square base and rounded upper levels.', 'Move around the perimeter without touching or climbing the elephants.', 'Compare the surface textures, stucco repairs and gilded summit.'] },
      { h: 'Timber roofs, naga details and hall layout', p: 'The temple halls show layered rooflines, carved gables and decorative entrances associated with northern Thai craftsmanship. The ordination hall (ubosot) serves a different ritual function from the larger assembly hall (viharn).', bullets: ['Look up at the overlapping eaves and finials before entering a building.', 'Notice raised thresholds and boundary markers around the ordination area.', 'Respect closed doors: a building may be used for worship or monastic activity.'] },
      { h: 'Phra Sila and Phra Kaeo Khao', p: 'The temple is associated with the Phra Sila stone Buddha relief and the small crystal image often called Phra Kaeo Khao or Phra Setang Khamani. Both are important devotional objects, with traditions that extend beyond their visual scale.', bullets: ['Treat dates and origin stories attached to the images as temple traditions where historical evidence varies.', 'View only from areas open to visitors; displays can change for ceremonies.', 'Avoid flash, touching cases or blocking worshippers.'] },
      { h: 'A four-stop architecture walk', p: 'Start in the courtyard, circle the chedi slowly, compare the viharn rooflines, then finish near the ordination hall. This sequence takes about 45 minutes if you pause for sketches or photographs.', bullets: ['Stop 1: wide photograph of the chedi and its base.', 'Stop 2: close observation of the elephant stucco from the walkway.', 'Stop 3: view carved gables and layered roof edges.', 'Stop 4: read any available interpretation and observe the devotional setting quietly.'] },
      { h: 'Photography and further reading', p: 'Late-afternoon side light can make surface relief easier to see. Do not enter restricted halls to chase a particular angle. For a broader chronology, continue to the history guide; for the dress code and access information, see the visitor guide linked below.' },
    ],
    faqs: [
      { q: 'What is unusual about the Wat Chiang Man chedi?', a: 'Its base is decorated with projecting elephant figures that appear to support the stupa above.' },
      { q: 'Is the whole temple from 1296?', a: 'No. The temple has an early foundation, but surviving structures reflect later repairs and rebuilding.' },
      { q: 'Where are the crystal and stone Buddhas?', a: 'They are associated with the temple halls; availability for viewing can vary with religious activities.' },
    ],
  },
  'old-city-walking-route': {
    slug: 'old-city-walking-route', nav: 'Old City walking itinerary',
    title: 'Wat Chiang Man Walking Route | Chiang Mai Old City',
    description: 'Plan a half-day Chiang Mai Old City walk from Wat Chiang Man to Three Kings Monument, Wat Chedi Luang and Wat Phra Singh, with separate map destinations.',
    label: 'Explore the neighbourhood', heading: 'Half-day walking route from Wat Chiang Man through Chiang Mai Old City',
    lead: 'This self-guided route links four historic places within the Old City moat. It begins at Wat Chiang Man, follows quieter central streets to Three Kings Monument and continues to two major temples. Allow a relaxed half-day including stops, shade and refreshments.',
    quickFacts: [{ label: 'Start', value: 'Wat Chiang Man, Ratchapakhinai Road' }, { label: 'Suggested duration', value: '3–4 hours with temple visits' }, { label: 'Travel mode', value: 'Walking; allow for heat and crossings' }],
    sections: [
      { h: 'Stop 1 — Wat Chiang Man', p: 'Begin with the elephant-supported chedi and a short introduction to the city’s early Lanna history. Allow 30–60 minutes and dress for a working monastery.', bullets: ['Address: 171 Ratchapakhinai Rd, Si Phum, Chiang Mai 50200, Thailand.', 'Google Maps: https://maps.google.com/?q=Wat+Chiang+Man+Chiang+Mai', 'Look for the elephant base, layered viharn roof and calm courtyard.'] },
      { h: 'Stop 2 — Three Kings Monument', p: 'Walk south-west through the northern Old City towards the civic square. The bronze monument commemorates the three kings linked to the founding narrative of Chiang Mai.', bullets: ['Google Maps: https://maps.google.com/?q=Three+Kings+Monument+Chiang+Mai', 'Use the square to orient yourself; surrounding museums have their own hours and admission policies.', 'Photograph the monument without blocking the surrounding public space.'] },
      { h: 'Stop 3 — Wat Chedi Luang', p: 'Continue south to the large brick chedi complex. Compare its monumental scale with the smaller elephant-supported chedi at Wat Chiang Man.', bullets: ['Google Maps: https://maps.google.com/?q=Wat+Chedi+Luang+Chiang+Mai', 'Check the current admission and hall-access rules at this separate temple.', 'Observe the chedi from designated paths; do not climb fragile masonry.'] },
      { h: 'Stop 4 — Wat Phra Singh', p: 'Walk west to a major Lanna religious complex known for its ornate halls and roof decoration. Finish here or return toward the Old City centre for food.', bullets: ['Google Maps: https://maps.google.com/?q=Wat+Phra+Singh+Chiang+Mai', 'Compare carved gables, gilded details and the atmosphere of a living monastery.', 'Check for services and religious ceremonies before entering halls.'] },
      { h: 'Planning and transport', p: 'This is an orientation route, not a fixed-timing tour. Street crossings, weather and time spent at each temple change the total. The destinations have independent Google Maps searches so you can adapt the order.', bullets: ['Start early to avoid the strongest midday heat; bring water and sun protection.', 'Do not assume all four sites share opening hours or ticket policies.', 'For a shorter outing, stop after Three Kings Monument; for a longer one, explore the museums and cafés nearby.'] },
      { h: 'Photography and accessibility', p: 'Choose shaded breaks and take care on uneven pavements. Temple halls can have steps; users needing step-free access should check each entrance locally. Morning or late-afternoon light is usually easier for exterior photography than midday sun.' },
    ],
    faqs: [
      { q: 'Can I walk to Three Kings Monument from Wat Chiang Man?', a: 'Yes. Both are within the Old City; use the individual map links to choose a suitable walking route.' },
      { q: 'Is a half-day enough for all four stops?', a: 'A half-day is a practical starting point if you keep each visit focused. Allow longer for museums, ceremonies or rest.' },
      { q: 'Do all temples have free entry?', a: 'No. Wat Chiang Man is generally free, but confirm admission policies individually at the other temples.' },
    ],
  },
};

export const extraZh: NewPages = {
  'entrance-fee-and-hours': {
    slug: 'entrance-fee-and-hours', nav: '门票与开放时间', title: '清曼寺门票、开放时间与参观须知｜2026', description: '清曼寺需要门票吗？整理免费入场、开放时间、具体地址、服装礼仪与30–60分钟游览路线。', label: '出发前必读', heading: '清曼寺门票、开放时间与实用参观信息',
    lead: '清曼寺是清迈古城北部仍在使用的佛教寺院。参观时可重点欣赏象托佛塔、兰纳风格殿堂与庭院；宗教活动期间，个别殿堂可能暂停游客进入。',
    quickFacts: [{ label: '普通入场', value: '免费；捐献自愿' }, { label: '本站列示时间', value: '每日 05:00–19:00，以现场为准' }, { label: '具体地址', value: '泰国清迈府清迈市 Si Phum，Ratchapakhinai 路171号，50200' }],
    sections: [
      { h: '清曼寺需要买门票吗？', p: '一般进入寺院庭院免费，无需为参观象托佛塔购买门票。随喜捐献、香花供养属于个人选择，不应与入场收费混为一谈。', bullets: ['可带少量泰铢现金，按意愿捐献。', '普通自由参观不需要提前预约门票。', '若遇法会或个别殿堂限制，以现场公告与寺方安排为准。'] },
      { h: '开放时间与最佳参观时段', p: '本站目前列示每日05:00–19:00；不同公开资料的营业时间并不完全一致，殿堂开放也可能短于庭院。佛教节日或特别活动期间，请在现场核实。', bullets: ['早晨相对凉爽，可安静观察寺院日常。', '正午注意防晒和补水。', '傍晚光线适合拍象托佛塔，但不宜压线赶到。'] },
      { h: '服装、礼仪与拍照', p: '这里是礼佛场所，建议遮肩盖膝，进入指定殿堂前脱鞋；有人诵经或参拜时保持安静。', bullets: ['准备饮水与适合古城步行的鞋。', '不攀爬佛塔基座或大象雕塑。', '拍摄僧侣和参拜者前先征得同意。'] },
      { h: '30–60分钟参观路线', p: '从 Ratchapakhinai 路入口进入，先欣赏象托佛塔，再观察周边殿堂与屋顶装饰，最后在庭院休息。', bullets: ['前10分钟：熟悉入口与佛塔整体形态。', '接下来15–25分钟：对照兰纳屋顶、雕花与允许参观的佛像空间。', '最后10–20分钟：庭院拍照，之后可步行前往三王纪念碑。'] },
      { h: '地址、管理与无障碍', p: '地址：171 Ratchapakhinai Rd, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand。寺院由寺方僧团维持日常宗教活动与出入安排。', bullets: ['位于古城护城河内，步行或短途搭车通常比寻找停车位方便。', '部分地面不平、殿堂有门槛，无障碍通行请现场询问。', '使用本页的清曼寺专属 Google 地图入口导航。'] },
    ], faqs: [{ q: '清曼寺门票多少钱？', a: '一般参观免费，可自愿捐献。' }, { q: '清曼寺每天都开放吗？', a: '本站列示每日05:00–19:00，实际时段与殿堂开放请现场核实。' }, { q: '需要游览多久？', a: '建议预留30–60分钟，喜欢建筑与摄影者可安排更久。' }, { q: '能穿短裤进去吗？', a: '建议穿着遮肩盖膝，尤其进入佛殿时。' }],
  },
  'lanna-architecture': {
    slug: 'lanna-architecture', nav: '兰纳建筑与佛像', title: '清曼寺建筑特色：象托佛塔、兰纳殿堂与珍贵佛像', description: '深入认识清迈清曼寺的象托佛塔、兰纳式木构屋顶、石佛与水晶佛，并附建筑观察路线。', label: '从建筑读历史', heading: '清曼寺的兰纳建筑：象托佛塔、木构殿堂与佛像',
    lead: '清曼寺与孟莱王建立清迈城的早期历史密切相关。这里的建筑并非同一年代的完整遗存；象托佛塔、层叠屋顶与供奉的珍贵佛像共同呈现寺院的历史层次。',
    quickFacts: [{ label: '标志建筑', value: '象托佛塔 Chedi Chang Lom' }, { label: '建筑传统', value: '泰北兰纳佛教建筑' }, { label: '建议时间', value: '45–60分钟' }],
    sections: [
      { h: '关于清曼寺与管理主体', p: '清曼寺是仍在使用的佛教寺院，日常宗教空间由寺方僧团及相关维护力量照料。它不是单纯的古迹博物馆：历代修缮与扩建也是其建筑价值的一部分。' },
      { h: '象托佛塔：为什么大象托着塔身？', p: '佛塔基座周围的大象灰泥塑像仿佛承托上方塔身，是清曼寺最鲜明的视觉符号，也反映了兰纳时代纪念性建筑的表达方式。', bullets: ['站远一点观察方形基座与上部塔身比例。', '沿允许的步道绕行，不触碰或攀爬象雕。', '留意灰泥纹理、修缮痕迹与塔尖装饰。'] },
      { h: '重檐、木雕与殿堂功能', p: '寺内殿堂可见层叠屋檐、雕花山墙及入口装饰。布萨堂（ubosot）用于特定僧团仪式，与普通礼佛集会的佛殿（viharn）功能有所不同。', bullets: ['进入前先看屋脊、屋檐与山墙。', '注意门槛及布萨堂周围的结界标识。', '遇到关闭的建筑不要擅自进入。'] },
      { h: '石佛与水晶佛', p: '寺院以 Phra Sila 石佛与 Phra Kaeo Khao（又称 Phra Setang Khamani）水晶佛著称。相关来历有历史记载与寺院传说，参观时应分别理解。', bullets: ['以现场允许参观的区域为准，法会期间可能调整展示。', '避免闪光灯、触摸展示柜或妨碍礼佛者。', '不要把传说中的年代直接当作已证实的考古结论。'] },
      { h: '四站建筑观察路线', p: '从庭院开始，缓慢绕行佛塔，再比较佛殿屋顶，最后观察布萨堂周边。若逐处摄影与阅读说明，约需45分钟。', bullets: ['第一站：拍摄象托佛塔整体。', '第二站：观察步道旁的大象灰泥雕塑。', '第三站：比较重檐与木雕山墙。', '第四站：阅读解说，安静观察寺院宗教生活。'] },
      { h: '摄影与进一步阅读', p: '下午斜射光线更容易显示雕塑浮凸；不要为了机位跨入封闭空间。可继续阅读本站历史专题，以及门票与参观礼仪专题。' },
    ], faqs: [{ q: '象托佛塔有什么特色？', a: '基座外侧有凸出的灰泥大象雕塑，视觉上仿佛托起佛塔。' }, { q: '寺内建筑全部建于1296年吗？', a: '不是。寺院历史悠久，但建筑经历了多次修复与重建。' }, { q: '能看到水晶佛吗？', a: '展示与进入殿堂的安排可能随宗教活动改变，请在现场核实。' }],
  },
  'old-city-walking-route': {
    slug: 'old-city-walking-route', nav: '清迈古城步行路线', title: '清曼寺出发：清迈古城半日步行路线与地图', description: '从清曼寺步行串联三王纪念碑、契迪龙寺与帕辛寺，提供逐站介绍、独立 Google 地图与半日游览建议。', label: '周边路线', heading: '从清曼寺出发的清迈古城半日步行路线',
    lead: '这条自由步行路线串联护城河内四个历史地点：清曼寺、三王纪念碑、契迪龙寺与帕辛寺。包含寺院参观、休息与拍照，建议预留半天。',
    quickFacts: [{ label: '出发地点', value: '清曼寺，Ratchapakhinai 路' }, { label: '建议总时间', value: '3–4小时（含参观）' }, { label: '交通方式', value: '步行，注意高温与过街安全' }],
    sections: [
      { h: '第一站：清曼寺', p: '从象托佛塔开始了解清迈兰纳王朝初期历史，建议停留30–60分钟。', bullets: ['地址：171 Ratchapakhinai Rd, Si Phum, Chiang Mai 50200, Thailand。', '地图：https://maps.google.com/?q=Wat+Chiang+Man+Chiang+Mai', '观察象托塔基、佛殿重檐和安静庭院。'] },
      { h: '第二站：三王纪念碑', p: '向古城中北部的广场步行。铜像表现与清迈建城传说相关的三位国王，广场适合了解城市方位。', bullets: ['地图：https://maps.google.com/?q=Three+Kings+Monument+Chiang+Mai', '周围博物馆有独立开放时间与收费规则。', '拍照时不阻碍公共空间通行。'] },
      { h: '第三站：契迪龙寺 Wat Chedi Luang', p: '继续向南，欣赏大型砖砌佛塔，并与清曼寺尺度较小的象托佛塔作比较。', bullets: ['地图：https://maps.google.com/?q=Wat+Chedi+Luang+Chiang+Mai', '入场费用与殿堂开放请在该寺现场核实。', '仅沿指定区域行走，不攀爬古老砖塔。'] },
      { h: '第四站：帕辛寺 Wat Phra Singh', p: '向西抵达重要兰纳寺院，重点欣赏佛殿木雕、屋檐和宗教空间。可由此结束行程或回到古城中心用餐。', bullets: ['地图：https://maps.google.com/?q=Wat+Phra+Singh+Chiang+Mai', '比较不同殿堂的山墙与金色装饰。', '遇到诵经及法会时遵守参观限制。'] },
      { h: '行程安排与交通', p: '这不是固定计时的跟团路线；天气、过街与各站停留时间会影响全程。每站设有独立地图搜索地址，方便改变顺序。', bullets: ['尽量上午出发，准备水、帽子与防晒用品。', '不要假定四个地点的门票或开放时间相同。', '时间有限可在三王纪念碑结束；有余裕再加入博物馆或咖啡馆。'] },
      { h: '拍照与无障碍提示', p: '古城步道可能不平整，殿堂也可能有台阶；需要无障碍路径应逐站现场核实。清晨和傍晚更适合拍摄外立面，参拜者优先。' },
    ], faqs: [{ q: '清曼寺可以步行到三王纪念碑吗？', a: '可以，两者都在清迈古城内，可用各自的地图链接选择合适的人行路线。' }, { q: '半天能走完四站吗？', a: '精简参观通常可安排半天；若看博物馆或长时间休息，请延长行程。' }, { q: '四座景点都免费吗？', a: '不能一概而论；清曼寺一般免费，其他寺院及博物馆请分别核实。' }],
  },
};

export const extraTh: NewPages = {
  'entrance-fee-and-hours': {
    slug: 'entrance-fee-and-hours', nav: 'ค่าเข้าชมและเวลาเปิด', title: 'วัดเชียงมั่น ค่าเข้าชม เวลาเปิด และวิธีเที่ยว 2569', description: 'วัดเชียงมั่นเข้าฟรีหรือไม่ รวมเวลาเปิด ที่อยู่จริง การแต่งกาย และแผนเที่ยว 30–60 นาทีในเมืองเก่าเชียงใหม่', label: 'ก่อนออกเดินทาง', heading: 'ค่าเข้าชม เวลาเปิด และข้อมูลสำหรับเที่ยววัดเชียงมั่น',
    lead: 'วัดเชียงมั่นเป็นวัดพุทธที่ยังประกอบศาสนกิจในเขตเมืองเก่าด้านเหนือของเชียงใหม่ ชมเจดีย์ช้างล้อม วิหาร และลานวัดได้อย่างสงบ โดยบางอาคารอาจจำกัดการเข้าชมระหว่างพิธีกรรม',
    quickFacts: [{ label: 'ค่าเข้าชมทั่วไป', value: 'ฟรี ทำบุญตามศรัทธา' }, { label: 'เวลาที่คู่มือนี้ระบุ', value: 'ทุกวัน 05:00–19:00 น. ตรวจสอบหน้างาน' }, { label: 'ที่อยู่', value: '171 ถนนราชภาคินัย ต.ศรีภูมิ อ.เมืองเชียงใหม่ 50200' }],
    sections: [
      { h: 'วัดเชียงมั่นเสียค่าเข้าชมหรือไม่?', p: 'การเข้าชมบริเวณวัดโดยทั่วไปไม่มีค่าเข้าชม ไม่จำเป็นต้องซื้อตั๋วเพื่อชมลานวัดและเจดีย์ช้างล้อม การบริจาคหรือซื้อเครื่องสักการะเป็นความสมัครใจ', bullets: ['เตรียมธนบัตรย่อยหากต้องการทำบุญ', 'นักท่องเที่ยวทั่วไปไม่ต้องจองบัตรล่วงหน้า', 'หากมีพิธีหรือข้อจำกัดเฉพาะอาคาร ให้ปฏิบัติตามประกาศหน้างาน'] },
      { h: 'เวลาเปิดและช่วงเวลาน่าเที่ยว', p: 'คู่มือนี้ระบุเวลา 05:00–19:00 น. ทุกวัน แต่ข้อมูลเวลาเปิดจากแหล่งต่าง ๆ อาจไม่ตรงกัน และวิหารอาจเปิดสั้นกว่าลานวัด ควรตรวจสอบที่วัดโดยเฉพาะวันสำคัญทางศาสนา', bullets: ['ช่วงเช้าอากาศเย็นกว่า เหมาะกับการเดินชมอย่างสงบ', 'ช่วงกลางวันควรพักร่มและดื่มน้ำ', 'ช่วงบ่ายแก่แสงตกกระทบเจดีย์สวย แต่ไม่ควรไปใกล้เวลาปิด'] },
      { h: 'การแต่งกายและมารยาท', p: 'ควรสวมเสื้อปิดไหล่และกางเกงหรือกระโปรงคลุมเข่า ถอดรองเท้าก่อนเข้าพื้นที่ที่กำหนด และพูดเบาเมื่อมีผู้สวดมนต์', bullets: ['พกน้ำดื่มและรองเท้าที่เหมาะกับการเดินในเมืองเก่า', 'ไม่ปีนฐานเจดีย์หรือรูปปั้นช้าง', 'ขออนุญาตก่อนถ่ายภาพพระสงฆ์หรือผู้ประกอบพิธี'] },
      { h: 'แผนเที่ยว 30–60 นาที', p: 'เข้าจากถนนราชภาคินัย เริ่มที่เจดีย์ช้างล้อม จากนั้นชมหลังคาวิหารและอุโบสถจากพื้นที่ที่เปิดให้เข้าชม แล้วพักในลานวัด', bullets: ['10 นาทีแรก: สำรวจบริเวณและมองเจดีย์โดยรวม', '15–25 นาทีต่อมา: สังเกตหลังคาล้านนาและพระพุทธรูปที่เปิดให้ชม', '10–20 นาทีสุดท้าย: ถ่ายภาพอย่างสุภาพ ก่อนเดินต่อไปอนุสาวรีย์สามกษัตริย์'] },
      { h: 'ที่ตั้ง ผู้ดูแล และการเข้าถึง', p: 'ที่อยู่ 171 ถนนราชภาคินัย ตำบลศรีภูมิ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50200 ประเทศไทย วัดและคณะสงฆ์ดูแลกิจกรรมทางศาสนาและการเข้าถึงอาคารในแต่ละวัน', bullets: ['วัดอยู่ภายในคูเมือง การเดินหรือเดินทางระยะสั้นอาจสะดวกกว่าหาที่จอดรถ', 'พื้นบางจุดไม่เรียบและอาคารมีธรณีประตู ผู้ใช้รถเข็นควรสอบถามหน้างาน', 'ใช้ลิงก์ Google Maps ของวัดเชียงมั่นบนหน้านี้โดยตรง'] },
    ], faqs: [{ q: 'วัดเชียงมั่นค่าเข้าเท่าไร?', a: 'เข้าชมบริเวณวัดทั่วไปฟรี และสามารถบริจาคตามศรัทธา' }, { q: 'วัดเชียงมั่นเปิดทุกวันหรือไม่?', a: 'คู่มือนี้ระบุ 05:00–19:00 น. ทุกวัน แต่ควรตรวจสอบเวลาและการเข้าวิหารหน้างาน' }, { q: 'ใช้เวลาเที่ยวนานเท่าไร?', a: 'แนะนำ 30–60 นาที หากสนใจสถาปัตยกรรมอาจใช้นานกว่า' }, { q: 'ใส่กางเกงขาสั้นเข้าวัดได้ไหม?', a: 'ควรแต่งกายปิดไหล่และเข่า โดยเฉพาะเมื่อเข้าวิหาร' }],
  },
  'lanna-architecture': {
    slug: 'lanna-architecture', nav: 'สถาปัตยกรรมล้านนาและพระพุทธรูป', title: 'สถาปัตยกรรมวัดเชียงมั่น: เจดีย์ช้างล้อมและพระสำคัญ', description: 'สำรวจเจดีย์ช้างล้อม หลังคาวิหารล้านนา พระศิลา และพระแก้วขาว พร้อมเส้นทางสังเกตสถาปัตยกรรมภายในวัดเชียงมั่น', label: 'อ่านประวัติผ่านอาคาร', heading: 'สถาปัตยกรรมล้านนาของวัดเชียงมั่นและจุดสังเกต',
    lead: 'วัดเชียงมั่นสัมพันธ์กับการตั้งเมืองเชียงใหม่ในสมัยพญามังราย อาคารที่เห็นปัจจุบันสะท้อนการบูรณะหลายยุค เจดีย์ช้างล้อม หลังคาซ้อนชั้น และพระพุทธรูปศักดิ์สิทธิ์จึงเล่าเรื่องประวัติศาสตร์คนละมิติ',
    quickFacts: [{ label: 'จุดเด่น', value: 'เจดีย์ช้างล้อม' }, { label: 'รูปแบบ', value: 'สถาปัตยกรรมพุทธแบบล้านนา' }, { label: 'เวลาชม', value: 'ประมาณ 45–60 นาที' }],
    sections: [
      { h: 'เกี่ยวกับวัดและผู้ดูแล', p: 'วัดเชียงมั่นเป็นวัดที่ยังใช้งานจริง คณะสงฆ์และผู้เกี่ยวข้องดูแลกิจกรรมและพื้นที่ จึงไม่ใช่พิพิธภัณฑ์อาคารโบราณเพียงอย่างเดียว ร่องรอยการซ่อมแซมต่างยุคเป็นส่วนหนึ่งของประวัติศาสตร์วัด' },
      { h: 'เจดีย์ช้างล้อม', p: 'รูปช้างปูนปั้นยื่นออกจากฐานเจดีย์ราวกับรับน้ำหนักองค์เจดีย์ เป็นสัญลักษณ์เด่นที่สุดของวัดและสะท้อนแนวคิดด้านศาสนาและอำนาจในศิลปกรรมล้านนา', bullets: ['ถอยมองสัดส่วนฐานสี่เหลี่ยมกับส่วนบนของเจดีย์', 'เดินชมตามทางโดยไม่จับหรือปีนรูปช้าง', 'สังเกตผิวปูนปั้นและส่วนที่ผ่านการบูรณะ'] },
      { h: 'หลังคาซ้อนชั้นและหน้าบันแกะสลัก', p: 'วิหารและอุโบสถมีหลังคาลดชั้น งานไม้ และองค์ประกอบประดับแบบภาคเหนือ อุโบสถใช้ในสังฆกรรม แตกต่างจากวิหารที่ใช้ประกอบกิจกรรมสักการะทั่วไป', bullets: ['มองชายคาและหน้าบันก่อนเข้าอาคาร', 'ระวังธรณีประตูและแนวเขตอุโบสถ', 'ไม่เข้าอาคารที่ปิดเพื่อประกอบศาสนกิจ'] },
      { h: 'พระศิลาและพระแก้วขาว', p: 'วัดมีชื่อเสียงจากพระศิลาและพระแก้วขาวหรือพระเสตังคมณี ซึ่งเป็นพระพุทธรูปที่ผู้ศรัทธาเคารพบูชา เรื่องราวเกี่ยวกับอายุและต้นกำเนิดบางส่วนเป็นตำนานวัด ควรแยกจากหลักฐานทางประวัติศาสตร์', bullets: ['การเปิดให้ชมอาจเปลี่ยนตามพิธีกรรม', 'ไม่ใช้แฟลชหรือแตะตู้ประดิษฐาน', 'ให้พื้นที่แก่ผู้มาสักการะก่อน'] },
      { h: 'เส้นทางชมสถาปัตยกรรม 4 จุด', p: 'เริ่มที่ลานวัด เดินชมเจดีย์ เปรียบเทียบหลังคาวิหาร และปิดท้ายบริเวณอุโบสถ ใช้เวลาราว 45 นาทีหากหยุดสังเกตและถ่ายภาพ', bullets: ['จุดที่ 1: มุมกว้างของเจดีย์', 'จุดที่ 2: รายละเอียดช้างปูนปั้นจากทางเดิน', 'จุดที่ 3: หน้าบันและหลังคาซ้อนชั้น', 'จุดที่ 4: อ่านป้ายและสังเกตบรรยากาศอย่างสงบ'] },
      { h: 'ภาพถ่ายและข้อมูลต่อยอด', p: 'แสงเฉียงช่วงบ่ายช่วยให้เห็นลวดลายปูนปั้นชัดขึ้น ไม่ควรข้ามเขตปิดเพื่อหามุมถ่ายภาพ อ่านหน้าประวัติและคู่มือผู้เข้าชมของเว็บไซต์ต่อได้จากลิงก์ด้านล่าง' },
    ], faqs: [{ q: 'เจดีย์ช้างล้อมมีจุดเด่นอย่างไร?', a: 'มีรูปช้างปูนปั้นยื่นจากฐานโดยรอบ ดูเหมือนรองรับองค์เจดีย์' }, { q: 'อาคารทั้งหมดสร้างตั้งแต่ปี พ.ศ. 1839 หรือไม่?', a: 'ไม่ใช่ วัดมีรากฐานเก่าแก่ แต่อาคารได้รับการซ่อมแซมและสร้างใหม่หลายสมัย' }, { q: 'ชมพระแก้วขาวได้เสมอไหม?', a: 'การเปิดพื้นที่และการจัดแสดงขึ้นกับกิจกรรมทางศาสนา โปรดตรวจสอบหน้างาน' }],
  },
  'old-city-walking-route': {
    slug: 'old-city-walking-route', nav: 'เส้นทางเดินเมืองเก่า', title: 'เดินเที่ยวเมืองเก่าเชียงใหม่เริ่มที่วัดเชียงมั่น | ครึ่งวัน', description: 'เส้นทางเดินครึ่งวันจากวัดเชียงมั่น ผ่านอนุสาวรีย์สามกษัตริย์ วัดเจดีย์หลวง และวัดพระสิงห์ พร้อมลิงก์แผนที่เฉพาะจุด', label: 'เที่ยวใกล้วัด', heading: 'เส้นทางเดินเที่ยวครึ่งวันจากวัดเชียงมั่นในเมืองเก่าเชียงใหม่',
    lead: 'เส้นทางเดินด้วยตนเองเชื่อมสี่จุดประวัติศาสตร์ภายในคูเมือง ได้แก่ วัดเชียงมั่น อนุสาวรีย์สามกษัตริย์ วัดเจดีย์หลวง และวัดพระสิงห์ เผื่อเวลาพัก ดื่มน้ำ และถ่ายภาพประมาณครึ่งวัน',
    quickFacts: [{ label: 'เริ่มต้น', value: 'วัดเชียงมั่น ถนนราชภาคินัย' }, { label: 'เวลารวม', value: '3–4 ชั่วโมงรวมเวลาเที่ยว' }, { label: 'การเดินทาง', value: 'เดินเท้า ระวังแดดและทางข้าม' }],
    sections: [
      { h: 'จุดที่ 1 — วัดเชียงมั่น', p: 'เริ่มจากเจดีย์ช้างล้อมและประวัติยุคต้นของล้านนา ใช้เวลาประมาณ 30–60 นาที', bullets: ['ที่อยู่: 171 ถนนราชภาคินัย ต.ศรีภูมิ อ.เมืองเชียงใหม่ 50200 ประเทศไทย', 'แผนที่: https://maps.google.com/?q=Wat+Chiang+Man+Chiang+Mai', 'ชมฐานช้างปูนปั้น หลังคาวิหาร และลานวัด'] },
      { h: 'จุดที่ 2 — อนุสาวรีย์สามกษัตริย์', p: 'เดินไปทางตะวันตกเฉียงใต้สู่อาคารและลานกลางเมืองเก่า อนุสาวรีย์กล่าวถึงกษัตริย์สามพระองค์ในเรื่องการสร้างเมืองเชียงใหม่', bullets: ['แผนที่: https://maps.google.com/?q=Three+Kings+Monument+Chiang+Mai', 'พิพิธภัณฑ์รอบลานมีเวลาเปิดและค่าบริการแยกกัน', 'ถ่ายภาพโดยไม่กีดขวางผู้ใช้พื้นที่สาธารณะ'] },
      { h: 'จุดที่ 3 — วัดเจดีย์หลวง', p: 'เดินลงใต้เพื่อชมเจดีย์อิฐขนาดใหญ่ เปรียบเทียบกับเจดีย์ช้างล้อมที่วัดเชียงมั่น', bullets: ['แผนที่: https://maps.google.com/?q=Wat+Chedi+Luang+Chiang+Mai', 'ตรวจสอบค่าเข้าและการเข้าวิหารของวัดนี้แยกต่างหาก', 'ไม่ปีนโครงสร้างอิฐโบราณ'] },
      { h: 'จุดที่ 4 — วัดพระสิงห์', p: 'เดินต่อไปทางตะวันตก ชมวิหาร งานไม้ และหลังคาตกแต่งแบบล้านนา จากนั้นพักรับประทานอาหารในเมืองเก่าได้', bullets: ['แผนที่: https://maps.google.com/?q=Wat+Phra+Singh+Chiang+Mai', 'สังเกตหน้าบันและลวดลายของวิหาร', 'เคารพพิธีกรรมและพื้นที่ที่จำกัดการเข้า'] },
      { h: 'วางแผนเวลาและการเดินทาง', p: 'นี่เป็นเส้นทางแนะนำ ไม่ใช่โปรแกรมที่กำหนดนาทีตายตัว อากาศ การข้ามถนน และเวลาชมแต่ละวัดส่งผลต่อระยะเวลา ทุกจุดมีลิงก์ Google Maps แยกกัน', bullets: ['เริ่มเช้าเพื่อหลบแดด เตรียมน้ำและหมวก', 'เวลาเปิดและค่าบริการของแต่ละสถานที่ไม่จำเป็นต้องเท่ากัน', 'หากมีเวลาน้อยจบที่อนุสาวรีย์สามกษัตริย์ได้'] },
      { h: 'ถ่ายภาพและการเข้าถึง', p: 'ทางเท้าในเมืองเก่าอาจขรุขระและวิหารบางแห่งมีขั้นบันได ผู้ที่ต้องการทางลาดควรสอบถามแต่ละแห่ง แสงเช้าหรือบ่ายเหมาะกับภาพอาคาร และควรให้ความสำคัญกับผู้มาสักการะ' },
    ], faqs: [{ q: 'เดินจากวัดเชียงมั่นไปอนุสาวรีย์สามกษัตริย์ได้ไหม?', a: 'ได้ ทั้งสองแห่งอยู่ในเขตเมืองเก่า ใช้แผนที่ของแต่ละจุดเพื่อเลือกทางเดิน' }, { q: 'ครึ่งวันพอสำหรับสี่จุดหรือไม่?', a: 'พอสำหรับการชมแบบกระชับ หากต้องการเข้าพิพิธภัณฑ์หรือพักนานควรเผื่อเวลาเพิ่ม' }, { q: 'ทุกจุดเข้าฟรีหรือไม่?', a: 'ไม่เสมอไป วัดเชียงมั่นโดยทั่วไปเข้าฟรี แต่ควรตรวจสอบค่าบริการของสถานที่อื่นแยกกัน' }],
  },
};
