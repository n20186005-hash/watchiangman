import type { SubPage } from './types';

type NewNearby = 'wat-lam-chang' | 'chiang-mai-city-arts-centre' | 'wat-inthakhin-sadue-muang';
type NewNearbySet = Record<NewNearby, SubPage>;

const places = {
  lam: { name: 'Wat Lam Chang', address: '32 Moon Muang Road Lane 7, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Lam+Chang+Chiang+Mai+Thailand', image: '/gallery/nearby-wat-lam-chang.jpg', alt: 'Ornate Lanna temple façade at Wat Lam Chang, Chiang Mai' },
  museum: { name: 'Chiang Mai City Arts & Cultural Centre', address: 'Prapokkloa Road, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chiang+Mai+City+Arts+and+Cultural+Centre+Thailand', image: '/gallery/nearby-city-arts-centre.jpg', alt: 'Historic civic building housing Chiang Mai City Arts and Cultural Centre' },
  intha: { name: 'Wat Inthakhin Sadue Mueang', address: '13 Inthawarorot Road, Si Phum, Mueang Chiang Mai District, Chiang Mai 50200, Thailand', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wat+Inthakhin+Sadue+Mueang+Chiang+Mai', image: '/gallery/nearby-wat-inthakhin.jpg', alt: 'Decorated temple hall at Wat Inthakhin Sadue Mueang in Chiang Mai' },
};

export const moreEn: NewNearbySet = {
  'wat-lam-chang': {
    slug: 'wat-lam-chang', nav: 'Wat Lam Chang', title: 'Wat Lam Chang Chiang Mai: Elephant History & Temple Guide', description: 'Explore Wat Lam Chang near Wat Chiang Man: early Lanna history, elephant associations, architecture, location, etiquette and a walking route.', label: 'Quiet temple near Wat Chiang Man', heading: 'Wat Lam Chang: an elephant-linked temple in northern Chiang Mai Old City',
    lead: 'Wat Lam Chang is a smaller working temple close to Wat Chiang Man. Its name and local stories recall elephants associated with the early royal city. For visitors who want a quieter comparison with Chiang Mai’s best-known temples, it is a worthwhile short detour.',
    destination: places.lam, photos: [{ src: places.lam.image, alt: places.lam.alt }], management: { heading: 'About Wat Lam Chang and its custodians', body: 'Wat Lam Chang is maintained as a living Buddhist monastery by its monastic community and supporting temple caretakers. Religious observance comes before sightseeing. The site is associated in local tradition with the elephants kept in the royal precinct during the city’s early period; individual historical details should be understood in the context of Lanna traditions.' },
    quickFacts: [{ label: 'Type', value: 'Active Buddhist temple' }, { label: 'Address', value: places.lam.address }, { label: 'Recommended stay', value: '20–40 minutes' }],
    sections: [
      { h: 'The elephant connection in Lanna history', p: 'The name Lam Chang evokes the tethering or keeping of elephants. Local tradition places the temple in the landscape of early Chiang Mai royal activity, although the precise story has changed in retelling. Its identity is easiest to appreciate after seeing the elephant-supported chedi at Wat Chiang Man.' },
      { h: 'Architecture and what to observe', p: 'Look for elaborate golden gable decoration, layered northern Thai roofs and naga-shaped stair rails. The compact compound allows close observation of workmanship without the crowds common at larger temples.', bullets: ['Start with a wide view of the viharn façade.', 'Compare its decorative gable with Wat Chiang Man’s timber details.', 'Keep a respectful distance from active devotional spaces.'] },
      { h: 'Cultural experience and temple etiquette', p: 'The temple continues to host Buddhist devotion. Cover shoulders and knees, take shoes off before entering halls and do not interrupt monks, residents or visitors making offerings. Ask before photographing people.' },
      { h: 'Walking route from Wat Chiang Man', p: 'Use the dedicated map to take a short walk within the northern Old City lanes. Add Wat Lam Chang to a 60–90 minute pair of temple visits; continue toward Three Kings Monument if you want a longer circuit.', bullets: ['Begin at Wat Chiang Man’s Ratchapakhinai Road entrance.', 'Follow the named Wat Lam Chang map destination through local streets.', 'Compare elephant stories at both temple compounds.'] },
      { h: 'Photo spots and local advice', p: 'The richly decorated roof and entrance are strongest from a few steps back. A side angle adds greenery and courtyard context. Do not stand on steps or block worshippers to get a symmetrical composition.' },
      { h: 'Accommodation and nearby food', p: 'The northern Old City has small guesthouses and neighbourhood cafés within an easy walk. Compare current opening times and prices rather than planning around a specific vendor.' },
    ],
    faqs: [{ q: 'Is Wat Lam Chang near Wat Chiang Man?', a: 'Yes. Both are in the northern Old City and can be visited on one short walk.' }, { q: 'Why is it associated with elephants?', a: 'Its name and local traditions refer to elephants linked with Chiang Mai’s early royal precinct.' }, { q: 'Is there an admission fee?', a: 'Check signs at the temple entrance; donations may be offered voluntarily.' }, { q: 'How long should I allow?', a: 'About 20–40 minutes for a quiet look at the architecture and grounds.' }],
  },
  'chiang-mai-city-arts-centre': {
    slug: 'chiang-mai-city-arts-centre', nav: 'City Arts & Cultural Centre', title: 'Chiang Mai City Arts & Cultural Centre Visitor Guide', description: 'Visit the City Arts and Cultural Centre behind Three Kings Monument: Chiang Mai history displays, historic building, admission tips and directions.', label: 'Learn the city’s story', heading: 'Chiang Mai City Arts & Cultural Centre: history inside the former civic building',
    lead: 'Facing the Three Kings Monument square, the Chiang Mai City Arts & Cultural Centre introduces the city’s settlement, Lanna heritage and changing urban culture. It is a strong indoor complement to the temples in the Old City.',
    destination: places.museum, photos: [{ src: places.museum.image, alt: places.museum.alt }], management: { heading: 'About the centre and its management', body: 'The City Arts & Cultural Centre occupies a former civic administration building and presents Chiang Mai history for public learning. It is part of the city’s cultural-museum environment; museum staff and local cultural administration control opening hours, tickets and exhibitions. These arrangements are independent of the public square in front.' },
    quickFacts: [{ label: 'Type', value: 'City-history museum and heritage building' }, { label: 'Address', value: places.museum.address }, { label: 'Recommended stay', value: '60–90 minutes, depending on exhibitions' }],
    sections: [
      { h: 'From civic administration to city museum', p: 'The building stands behind the Three Kings Monument, connecting Chiang Mai’s modern civic history with stories of its older Lanna capital. Its exhibition programme presents historical changes through objects, displays and interpretation rather than temple rituals.' },
      { h: 'Building and exhibition highlights', p: 'The symmetrical façade, wide forecourt and restrained civic architectural details contrast with the richly ornamented temples nearby. Inside, the value lies in the city-history interpretation and changing exhibitions.', bullets: ['Observe the façade and the relationship to Three Kings Monument.', 'Look for timelines explaining the foundation of Chiang Mai.', 'Allow time for text panels and exhibits rather than rushing through.'] },
      { h: 'Opening hours, tickets and access', p: 'This is a museum with its own ticketing and opening schedule, not a permanently open public plaza. Check the centre’s current announcements before visiting and ask on-site about discounts, accessible routes and photography restrictions.' },
      { h: 'How to reach the museum', p: 'Walk from Wat Chiang Man towards Three Kings Monument; the museum building faces the monument across the same civic square. Use the centre-specific Google Maps link to avoid confusing the building with the monument.', bullets: ['Start from Wat Chiang Man in the northern Old City.', 'Stop in the square for monument photographs.', 'Enter the museum if it is open, then walk south toward Wat Chedi Luang.'] },
      { h: 'Photography and visitor experience', p: 'The front elevation works well as a wide establishing shot with the square. Indoor photo rules may differ between galleries, so follow signs and staff instructions. Bring time for thoughtful reading of exhibits.' },
      { h: 'Nearby stays and food', p: 'Central Old City accommodation is convenient for combining museums and temples on foot. Restaurants and cafés around the central lanes make natural breaks between indoor and outdoor visits.' },
    ],
    faqs: [{ q: 'Is the centre the same as Three Kings Monument?', a: 'No. The monument is outdoors in the square; the centre is a museum in the historic building behind it.' }, { q: 'Do I need a ticket?', a: 'Museum admission is separate from the free-to-view public square; check current rates at the entrance.' }, { q: 'How much time do I need?', a: 'Plan about 60–90 minutes if you want to read the displays.' }, { q: 'Can I combine it with Wat Chiang Man?', a: 'Yes, they fit naturally into one Old City walking route.' }],
  },
  'wat-inthakhin-sadue-muang': {
    slug: 'wat-inthakhin-sadue-muang', nav: 'Wat Inthakhin Sadue Mueang', title: 'Wat Inthakhin Sadue Mueang: City Navel Temple Guide', description: 'Discover Wat Inthakhin Sadue Mueang near Three Kings Monument: Chiang Mai city-pillar history, Lanna hall, access, photos and walking route.', label: 'Chiang Mai’s ceremonial centre', heading: 'Wat Inthakhin Sadue Mueang: the temple of the city’s navel',
    lead: 'The name Sadue Mueang means the navel or centre of the city. This small temple near Three Kings Monument is linked to traditions surrounding Chiang Mai’s city pillar, later associated with Wat Chedi Luang. It adds a different layer to an Old City heritage walk.',
    destination: places.intha, photos: [{ src: places.intha.image, alt: places.intha.alt }], management: { heading: 'About Wat Inthakhin and its custodians', body: 'Wat Inthakhin Sadue Mueang is a Buddhist heritage site within the historic civic precinct. Temple and local heritage caretakers attend to its religious and built environment. The historical association with the city pillar is rooted in local tradition, while the original pillar’s chronology is interpreted differently by scholars.' },
    quickFacts: [{ label: 'Type', value: 'Historic Buddhist temple' }, { label: 'Address', value: places.intha.address }, { label: 'Suggested stay', value: '20–40 minutes' }],
    sections: [
      { h: 'What does “navel of the city” mean?', p: 'In northern Thai ideas of urban geography, the city had a symbolic centre. Wat Inthakhin is associated with the former location of the Inthakhin city pillar. Later traditions place the pillar at Wat Chedi Luang, but the exact history deserves careful distinction between belief and documented chronology.' },
      { h: 'Lanna architecture and observation points', p: 'The richly decorated viharn façade, gilded timber work, tiered roof and serpent guardians are distinctive features. The temple’s smaller scale makes it easier to notice ornamental craftsmanship.', bullets: ['Frame the whole hall to capture its roof silhouette.', 'Look closely at the gilded carved gable without touching it.', 'Notice the naga guardians and the relationship between entrance and courtyard.'] },
      { h: 'Religious significance and etiquette', p: 'The site reflects the intersection of Buddhist practice and the city’s protective traditions. Dress modestly, remove shoes in designated hall areas and stay quiet if prayer or worship is taking place.' },
      { h: 'Walking from Three Kings Monument', p: 'The temple is in the same central Old City area. Follow its own map destination rather than the monument pin, then continue south to Wat Chedi Luang to explore the city-pillar story across two locations.', bullets: ['Visit Three Kings Monument first to understand the civic setting.', 'Walk to Wat Inthakhin for its decorated hall.', 'Continue to Wat Chedi Luang and compare the city-pillar accounts.'] },
      { h: 'Photo locations and practical tips', p: 'A frontal view works for the highly decorated façade; a slight side angle adds depth. Avoid standing directly in the path of visitors entering to worship. Check hall access and opening arrangements on-site.' },
      { h: 'Where to stay nearby', p: 'Choose central Old City lodging for convenient walking among the monument, city-history museum and nearby temples. Current room prices and availability vary by season.' },
    ],
    faqs: [{ q: 'What does Wat Inthakhin Sadue Mueang mean?', a: 'The name refers to the city’s navel or symbolic centre.' }, { q: 'Is the city pillar still here?', a: 'The site is associated with the pillar’s earlier history; the pillar is now associated with Wat Chedi Luang.' }, { q: 'How long should I visit?', a: 'Allow around 20–40 minutes to see the exterior details and compound.' }, { q: 'Is it near Three Kings Monument?', a: 'Yes, both belong to the central Old City heritage area.' }],
  },
};

export const moreZh: NewNearbySet = {
  'wat-lam-chang': {
    ...moreEn['wat-lam-chang'], nav: '拴象寺 Wat Lam Chang', title: '清迈拴象寺：大象传说、兰纳建筑与步行攻略', description: '清曼寺附近的 Wat Lam Chang 拴象寺，介绍王室大象传说、建筑特色、参观礼仪、具体地图和摄影路线。', label: '清曼寺附近的小寺院', heading: '拴象寺 Wat Lam Chang：清迈古城的大象历史与兰纳建筑',
    lead: '拴象寺位于清曼寺附近的古城北部街巷，寺名与早期王室养象、拴象的地方传统相关。若想在热门寺庙之外感受安静的兰纳建筑，这是一处适合短暂停留的地点。',
    management: { heading: '关于拴象寺及管理主体', body: '拴象寺是一座仍有佛教宗教生活的寺院，寺方僧团及相关人员负责日常维护与礼佛空间安排。寺名及大象故事与早期清迈王室传统有关；其中部分细节属于地方历史记忆，宜与有据可查的建筑事实区分。' },
    quickFacts: [{ label: '类型', value: '佛教寺院' }, { label: '地址', value: places.lam.address }, { label: '建议停留', value: '20–40分钟' }],
    sections: [
      { h: '历史背景：为什么叫拴象寺？', p: 'Wat Lam Chang 的名称使人联想到系留大象的地方。当地传统将它与清迈建城早期的王室活动联系起来，若先参观清曼寺象托佛塔，再来此了解大象主题，能把两处历史串联起来。' },
      { h: '建筑特色与观察重点', p: '佛殿可见金色雕花山墙、重叠屋檐和蛇神扶栏，院落相对紧凑，可以近距离欣赏兰纳工艺。', bullets: ['从院落拍摄佛殿整体与金色山墙。', '与清曼寺木雕及塔基装饰作比较。', '礼佛空间请保持距离并安静观察。'] },
      { h: '寺院文化与参观礼仪', p: '这是一座活动中的寺院，参观者需遮肩盖膝，按标识脱鞋。不要打扰诵经、供养或寺务活动；拍摄僧侣及参拜者前先询问。' },
      { h: '从清曼寺步行的建议路线', p: '在清迈古城北部街巷短距离步行，使用本页专属地图到达拴象寺。两寺组合适合安排60–90分钟，也可延伸前往三王纪念碑。', bullets: ['先参观清曼寺象托佛塔。', '沿地图行人路线前往拴象寺。', '对比两处与大象相关的地方故事。'] },
      { h: '摄影机位与游览须知', p: '从佛殿正面略退几步，可完整拍下金色山墙；从侧面则可把庭院树木收入构图。不要占用参拜者出入的台阶。' },
      { h: '住宿与餐饮', p: '清迈古城北部有小型旅馆与本地咖啡馆，适合步行游览。请按实际营业状况与价格安排休息。' },
    ], faqs: [{ q: '拴象寺离清曼寺近吗？', a: '很近，两者都在古城北部，可安排同一段步行路线。' }, { q: '为什么与大象有关？', a: '寺名及地方传说与早期王室大象活动有关。' }, { q: '需要门票吗？', a: '请以现场标示为准；捐献可随喜。' }, { q: '适合停留多久？', a: '约20–40分钟，适合欣赏建筑与庭院。' }],
  },
  'chiang-mai-city-arts-centre': {
    ...moreEn['chiang-mai-city-arts-centre'], nav: '清迈城市艺术文化中心', title: '清迈城市艺术文化中心：展览、历史建筑与参观信息', description: '位于三王纪念碑后方的清迈城市艺术文化中心，介绍城市历史展览、建筑、门票、开放提示及从清曼寺步行交通。', label: '走进清迈城市历史', heading: '清迈城市艺术文化中心：旧行政建筑里的兰纳城市故事',
    lead: '清迈城市艺术文化中心位于三王纪念碑广场后方，利用城市历史、兰纳文化和社会变迁展示，帮助游客把寺庙和古城街道放入更完整的历史背景中。',
    management: { heading: '关于文化中心及管理主体', body: '文化中心设在旧行政建筑内，是清迈公共文化与博物馆体系的一部分。展览、票务及开放安排由馆方与相关地方文化管理单位负责，和前方可自由参观的三王纪念碑广场有不同的参观规则。' },
    quickFacts: [{ label: '类型', value: '城市历史博物馆与历史建筑' }, { label: '地址', value: places.museum.address }, { label: '建议停留', value: '60–90分钟，视展览而定' }],
    sections: [
      { h: '从地方行政建筑到城市博物馆', p: '旧行政建筑位于三王纪念碑背后，将现代清迈的城市行政史与兰纳古都的历史相连。馆内通过展板、物件及专题内容介绍城市形成与变迁。' },
      { h: '建筑与展览看点', p: '对称的白色建筑立面、宽阔广场与简洁的公共建筑风格，与附近精细繁复的寺庙形成反差。', bullets: ['观察建筑立面与三王纪念碑的空间关系。', '留意介绍清迈建城的时间线。', '为展板和展品阅读留出充足时间。'] },
      { h: '开放时间、票价与无障碍', p: '这里是有独立票务与营业安排的博物馆，并非全天开放广场。入馆前请查看当期公告，并在现场核实优惠、无障碍通道和摄影规定。' },
      { h: '从清曼寺步行前往', p: '由清曼寺走向三王纪念碑，文化中心就在广场后方。请使用文化中心专属地图，以免导航只停在纪念碑。', bullets: ['从清曼寺出发穿行古城街道。', '先在广场拍摄三王纪念碑。', '入馆参观后可向南前往契迪龙寺。'] },
      { h: '摄影机位与参观体验', p: '从广场边缘拍摄对称的白色立面最能体现建筑特色。室内摄影是否允许由各展厅决定，请遵守标识。' },
      { h: '住宿与餐饮', p: '古城中心适合以步行为主的游客，附近街巷有多种住宿和餐饮选择，可安排在室内博物馆与户外寺庙之间休息。' },
    ], faqs: [{ q: '文化中心和三王纪念碑是同一个景点吗？', a: '不是。纪念碑位于户外广场，文化中心是其后方历史建筑内的博物馆。' }, { q: '参观需要门票吗？', a: '博物馆有独立票务安排，详情请在入口核实。' }, { q: '预留多少时间？', a: '建议60–90分钟，以便阅读展览。' }, { q: '能和清曼寺一起游览吗？', a: '可以，适合组合为古城半日步行路线。' }],
  },
  'wat-inthakhin-sadue-muang': {
    ...moreEn['wat-inthakhin-sadue-muang'], nav: '因他金城脐寺', title: '清迈因他金城脐寺：城市之柱历史与兰纳建筑', description: 'Wat Inthakhin Sadue Mueang 详细参观指南，了解清迈城市之柱故事、佛殿建筑、位置、摄影与古城步行路线。', label: '清迈城市中心的象征', heading: '因他金城脐寺：清迈「城市之脐」的宗教与历史',
    lead: 'Sadue Mueang 意为城市之脐或象征中心。这处三王纪念碑附近的小寺院与清迈城市之柱传统相关，也可和如今供奉城市之柱的契迪龙寺串联游览。',
    management: { heading: '关于城脐寺及管理主体', body: '城脐寺是清迈古城历史宗教空间，由寺院及相关地方维护力量照料。与城市之柱的联系源自地方传统，学术研究对原始柱位和年代的解释并不完全一致，参观时宜保留历史与信仰的区别。' },
    quickFacts: [{ label: '类型', value: '历史佛教寺院' }, { label: '地址', value: places.intha.address }, { label: '建议停留', value: '20–40分钟' }],
    sections: [
      { h: '「城市之脐」是什么意思？', p: '在泰北传统城市观念里，城市存在象征性的中心。城脐寺常与因他金城市之柱的早期历史联系起来，而后来的传统将该柱与契迪龙寺相连。具体沿革需要区分地方信仰与史料证据。' },
      { h: '兰纳建筑与观察重点', p: '金色雕花佛殿、层叠屋顶与蛇神装饰是最醒目的元素，寺院较小，适合观察立面细部。', bullets: ['正面取景展示屋顶整体轮廓。', '观察镀金山墙雕花，不触摸古建装饰。', '留意入口蛇神和庭院布局。'] },
      { h: '宗教文化与参观礼仪', p: '这里融合佛教活动与城市保护性信仰。参观请保持着装得体，在要求的区域脱鞋，遇有人礼佛时降低音量。' },
      { h: '从三王纪念碑步行的路线', p: '寺院位于古城中心，需使用本站独立地图定位。建议先游三王纪念碑，再到城脐寺，随后向南前往契迪龙寺，对比两处的城市之柱叙事。', bullets: ['第一站：三王纪念碑了解建城故事。', '第二站：城脐寺观察佛殿与宗教传统。', '第三站：契迪龙寺了解城市之柱后续历史。'] },
      { h: '摄影位置与游览须知', p: '正面机位适合记录复杂雕花，侧面可以增加建筑纵深。不要占用参拜入口，开放情况与殿堂进入限制请现场核实。' },
      { h: '附近住宿', p: '古城中心的住宿方便步行参访纪念碑、博物馆和寺庙。价格与房量随季节变化，建议比较安静街巷的选择。' },
    ], faqs: [{ q: '城脐寺的名称是什么意思？', a: '指城市的象征中心或「城市之脐」。' }, { q: '城市之柱仍在这里吗？', a: '这里与城市之柱的早期传统相关，现今通常与契迪龙寺联系。' }, { q: '建议参观多久？', a: '约20–40分钟，可重点观察殿堂外观。' }, { q: '离三王纪念碑近吗？', a: '很近，两处均在古城中心的历史文化区域。' }],
  },
};

export const moreTh: NewNearbySet = {
  'wat-lam-chang': {
    ...moreEn['wat-lam-chang'], nav: 'วัดล่ามช้าง', title: 'วัดล่ามช้าง เชียงใหม่: ประวัติช้างและสถาปัตยกรรมล้านนา', description: 'คู่มือวัดล่ามช้างใกล้วัดเชียงมั่น ประวัติช้างหลวง วิหารล้านนา แผนที่เฉพาะจุด และเส้นทางเดินชมวัด', label: 'วัดสงบใกล้วัดเชียงมั่น', heading: 'วัดล่ามช้าง: เรื่องเล่าช้างหลวงในเมืองเก่าเชียงใหม่',
    lead: 'วัดล่ามช้างอยู่ในย่านเมืองเก่าตอนเหนือใกล้วัดเชียงมั่น ชื่อวัดเชื่อมโยงกับเรื่องเล่าเกี่ยวกับช้างในเขตพระราชฐานยุคแรก เหมาะสำหรับแวะชมงานศิลปกรรมล้านนาอย่างสงบ',
    management: { heading: 'เกี่ยวกับวัดล่ามช้างและผู้ดูแล', body: 'วัดล่ามช้างยังเป็นวัดพุทธที่มีศาสนกิจ คณะสงฆ์และผู้ดูแลวัดดูแลอาคารและพื้นที่สักการะ เรื่องเล่าเกี่ยวกับช้างหลวงเป็นส่วนหนึ่งของประเพณีท้องถิ่น ควรแยกจากข้อเท็จจริงด้านสถาปัตยกรรมที่สังเกตได้' },
    quickFacts: [{ label: 'ประเภท', value: 'วัดพุทธที่ยังใช้งาน' }, { label: 'ที่อยู่', value: places.lam.address }, { label: 'เวลาชม', value: '20–40 นาที' }],
    sections: [
      { h: 'ชื่อวัดกับประวัติช้างในล้านนา', p: 'คำว่าล่ามช้างหมายถึงการผูกหรือดูแลช้าง ตำนานท้องถิ่นโยงบริเวณนี้กับกิจกรรมของราชสำนักเชียงใหม่ยุคแรก การเที่ยวต่อจากเจดีย์ช้างล้อมที่วัดเชียงมั่นจะช่วยเห็นความเชื่อมโยงของสัญลักษณ์ช้าง' },
      { h: 'สถาปัตยกรรมและจุดสังเกต', p: 'หน้าบันสีทองอันประณีต หลังคาลดชั้น และราวบันไดนาคเป็นจุดเด่นของวิหารในบริเวณวัดที่มีขนาดกะทัดรัด', bullets: ['ถ่ายภาพวิหารและหน้าบันเต็มองค์จากลาน', 'เปรียบเทียบรายละเอียดกับวัดเชียงมั่น', 'ให้พื้นที่แก่ผู้เข้ามาสักการะ'] },
      { h: 'วัฒนธรรมและมารยาท', p: 'แต่งกายปิดไหล่และเข่า ถอดรองเท้าตามป้าย และไม่รบกวนพระสงฆ์หรือผู้ทำบุญ ขออนุญาตก่อนถ่ายภาพบุคคล' },
      { h: 'เดินจากวัดเชียงมั่นอย่างไร', p: 'ใช้แผนที่เฉพาะวัดล่ามช้าง เดินผ่านตรอกเมืองเก่าตอนเหนือ สามารถจัดสองวัดในช่วงประมาณ 60–90 นาที แล้วเดินต่อสู่อีกจุดในเมืองเก่า', bullets: ['เริ่มที่วัดเชียงมั่น', 'เดินตามเส้นทางไปวัดล่ามช้าง', 'เทียบเรื่องช้างและรูปแบบอาคารทั้งสองแห่ง'] },
      { h: 'มุมถ่ายภาพ', p: 'มุมตรงถ่ายหน้าบันได้ครบ มุมเฉียงแสดงต้นไม้และพื้นที่วัด หลีกเลี่ยงการยืนขวางทางเข้าวิหาร' },
      { h: 'ที่พักและอาหารใกล้เคียง', p: 'ย่านเมืองเก่าตอนเหนือมีเกสต์เฮาส์และคาเฟ่ในระยะเดิน ควรตรวจสอบเวลาเปิดและราคาปัจจุบัน' },
    ], faqs: [{ q: 'วัดล่ามช้างอยู่ใกล้วัดเชียงมั่นหรือไม่?', a: 'อยู่ใกล้กันในเมืองเก่าตอนเหนือ สามารถเดินเที่ยวต่อกันได้' }, { q: 'ทำไมชื่อเกี่ยวกับช้าง?', a: 'ชื่อและประเพณีท้องถิ่นเชื่อมโยงกับช้างในเขตราชสำนักยุคแรก' }, { q: 'มีค่าเข้าชมหรือไม่?', a: 'ตรวจสอบป้ายที่วัด สามารถทำบุญตามศรัทธา' }, { q: 'ควรใช้เวลานานเท่าไร?', a: 'ประมาณ 20–40 นาที' }],
  },
  'chiang-mai-city-arts-centre': {
    ...moreEn['chiang-mai-city-arts-centre'], nav: 'หอศิลปวัฒนธรรมเมืองเชียงใหม่', title: 'หอศิลปวัฒนธรรมเมืองเชียงใหม่: นิทรรศการและวิธีเที่ยว', description: 'เที่ยวหอศิลปวัฒนธรรมเมืองเชียงใหม่ด้านหลังอนุสาวรีย์สามกษัตริย์ เรียนรู้ประวัติเมือง อาคารเก่า ค่าเข้า และเส้นทางเดิน', label: 'เรียนรู้เรื่องเมืองเชียงใหม่', heading: 'หอศิลปวัฒนธรรมเมืองเชียงใหม่: ประวัติเมืองในอาคารเก่า',
    lead: 'หอศิลปวัฒนธรรมเมืองเชียงใหม่ตั้งอยู่หลังลานอนุสาวรีย์สามกษัตริย์ นิทรรศการช่วยอธิบายการก่อตั้งเมือง มรดกล้านนา และการเปลี่ยนแปลงทางสังคม เหมาะกับการเที่ยวควบคู่กับวัดในเมืองเก่า',
    management: { heading: 'เกี่ยวกับหอศิลปวัฒนธรรมและผู้ดูแล', body: 'พิพิธภัณฑ์ตั้งในอาคารราชการเก่า เป็นส่วนหนึ่งของพื้นที่วัฒนธรรมเมืองเชียงใหม่ เจ้าหน้าที่พิพิธภัณฑ์และหน่วยงานวัฒนธรรมท้องถิ่นดูแลนิทรรศการ เวลาเปิด และการจำหน่ายบัตร ซึ่งแยกจากลานอนุสาวรีย์สาธารณะด้านหน้า' },
    quickFacts: [{ label: 'ประเภท', value: 'พิพิธภัณฑ์ประวัติเมือง' }, { label: 'ที่อยู่', value: places.museum.address }, { label: 'เวลาชม', value: '60–90 นาที ตามนิทรรศการ' }],
    sections: [
      { h: 'จากอาคารราชการสู่พิพิธภัณฑ์', p: 'อาคารด้านหลังอนุสาวรีย์สามกษัตริย์เชื่อมประวัติราชการสมัยใหม่กับอดีตเมืองล้านนา นิทรรศการใช้ภาพ สิ่งของ และคำอธิบายเล่าการเติบโตของเชียงใหม่' },
      { h: 'สถาปัตยกรรมและจุดเด่นนิทรรศการ', p: 'อาคารสีอ่อนมีส่วนหน้าแบบสมมาตรและลานกว้าง ต่างจากวิหารประดับลวดลายที่อยู่ใกล้กัน', bullets: ['ชมด้านหน้าอาคารและความสัมพันธ์กับอนุสาวรีย์', 'มองหาลำดับเวลาการก่อตั้งเชียงใหม่', 'เผื่อเวลาอ่านป้ายและดูวัตถุจัดแสดง'] },
      { h: 'เวลาเปิด ค่าเข้าชม และการเข้าถึง', p: 'พิพิธภัณฑ์มีเวลาและค่าบัตรของตนเอง ไม่ใช่ลานสาธารณะที่เข้าได้ตลอด ตรวจสอบประกาศก่อนเดินทาง และสอบถามส่วนลด ทางลาด และข้อจำกัดการถ่ายภาพหน้างาน' },
      { h: 'เดินทางจากวัดเชียงมั่น', p: 'เดินมาทางอนุสาวรีย์สามกษัตริย์ อาคารพิพิธภัณฑ์อยู่หลังลาน ใช้แผนที่เฉพาะอาคารเพื่อไม่ให้สับสนกับจุดปักหมุดของอนุสาวรีย์', bullets: ['เริ่มจากวัดเชียงมั่น', 'แวะถ่ายภาพอนุสาวรีย์สามกษัตริย์', 'เข้าชมพิพิธภัณฑ์แล้วเดินต่อสู่วัดเจดีย์หลวง'] },
      { h: 'จุดถ่ายภาพและประสบการณ์', p: 'มุมกว้างจากลานช่วยแสดงรูปทรงสมมาตรของอาคาร การถ่ายภาพในห้องจัดแสดงต้องทำตามป้ายแต่ละห้อง' },
      { h: 'ที่พักและอาหาร', p: 'ย่านใจกลางเมืองเก่าเหมาะกับผู้ที่ต้องการเดินชมวัดและพิพิธภัณฑ์ มีร้านอาหารและที่พักหลายประเภทให้เปรียบเทียบ' },
    ], faqs: [{ q: 'หอศิลปวัฒนธรรมกับอนุสาวรีย์สามกษัตริย์เป็นที่เดียวกันหรือไม่?', a: 'ไม่ใช่ อนุสาวรีย์อยู่กลางแจ้ง ส่วนหอศิลปวัฒนธรรมเป็นพิพิธภัณฑ์ในอาคารด้านหลัง' }, { q: 'ต้องซื้อบัตรหรือไม่?', a: 'พิพิธภัณฑ์มีนโยบายค่าเข้าชมแยกจากลานสาธารณะ ตรวจสอบหน้างาน' }, { q: 'ควรเผื่อเวลาเท่าไร?', a: 'ประมาณ 60–90 นาที' }, { q: 'เที่ยวกับวัดเชียงมั่นได้ไหม?', a: 'ได้ เหมาะกับเส้นทางเดินครึ่งวันในเมืองเก่า' }],
  },
  'wat-inthakhin-sadue-muang': {
    ...moreEn['wat-inthakhin-sadue-muang'], nav: 'วัดอินทขิลสะดือเมือง', title: 'วัดอินทขิลสะดือเมือง: ประวัติเสาอินทขิลและวิธีเที่ยว', description: 'คู่มือวัดอินทขิลสะดือเมือง ประวัติสะดือเมือง สถาปัตยกรรมล้านนา แผนที่ จุดถ่ายภาพ และเส้นทางจากอนุสาวรีย์สามกษัตริย์', label: 'ใจกลางเมืองตามความเชื่อ', heading: 'วัดอินทขิลสะดือเมือง: วัดแห่งสะดือเมืองเชียงใหม่',
    lead: 'คำว่าสะดือเมืองสื่อถึงศูนย์กลางเชิงสัญลักษณ์ของเมือง วัดเล็กใกล้อนุสาวรีย์สามกษัตริย์แห่งนี้เกี่ยวข้องกับประเพณีเสาอินทขิล ซึ่งต่อมาเชื่อมโยงกับวัดเจดีย์หลวง',
    management: { heading: 'เกี่ยวกับวัดอินทขิลและผู้ดูแล', body: 'วัดอินทขิลสะดือเมืองเป็นสถานที่ทางพุทธศาสนาและมรดกประวัติศาสตร์ มีผู้ดูแลวัดและหน่วยงานเกี่ยวข้องช่วยบำรุงรักษา เรื่องความสัมพันธ์กับเสาอินทขิลเป็นประเพณีท้องถิ่น ขณะที่นักวิชาการยังอภิปรายรายละเอียดเวลาและสถานที่เดิม' },
    quickFacts: [{ label: 'ประเภท', value: 'วัดพุทธประวัติศาสตร์' }, { label: 'ที่อยู่', value: places.intha.address }, { label: 'เวลาชม', value: '20–40 นาที' }],
    sections: [
      { h: 'ความหมายของสะดือเมือง', p: 'แนวคิดเมืองล้านนามีจุดศูนย์กลางเชิงสัญลักษณ์ วัดอินทขิลสัมพันธ์กับเรื่องเล่าที่ตั้งเดิมของเสาหลักเมือง ก่อนจะเชื่อมโยงกับวัดเจดีย์หลวงในยุคหลัง ควรแยกประเพณีความเชื่อจากหลักฐานประวัติศาสตร์' },
      { h: 'งานศิลปกรรมล้านนา', p: 'วิหารตกแต่งลวดลายสีทอง หลังคาลดชั้น และนาคที่ทางเข้า เป็นจุดเด่นในพื้นที่วัดขนาดเล็ก', bullets: ['ถ่ายภาพหน้าวิหารให้เห็นหลังคาเต็มองค์', 'สังเกตลายแกะสลักโดยไม่แตะต้อง', 'ชมประติมากรรมนาคและลานหน้าวิหาร'] },
      { h: 'ศาสนาและมารยาท', p: 'สถานที่สะท้อนทั้งพุทธศาสนาและความเชื่อคุ้มครองเมือง แต่งกายสุภาพ ถอดรองเท้าตามป้าย และไม่รบกวนผู้ไหว้พระ' },
      { h: 'เดินจากอนุสาวรีย์สามกษัตริย์', p: 'วัดอยู่ในใจกลางเมืองเก่า ควรใช้แผนที่วัดอินทขิลโดยตรง แล้วเดินต่อไปวัดเจดีย์หลวงเพื่อเรียนรู้เรื่องเสาเมืองในอีกบริบทหนึ่ง', bullets: ['เริ่มจากอนุสาวรีย์สามกษัตริย์', 'เดินมาวัดอินทขิลเพื่อชมวิหาร', 'ไปวัดเจดีย์หลวงเพื่อศึกษาประเพณีเสาอินทขิลเพิ่มเติม'] },
      { h: 'มุมถ่ายภาพและข้อควรรู้', p: 'มุมหน้าวิหารเผยลวดลายได้ชัด มุมเฉียงช่วยเพิ่มมิติ ไม่ยืนขวางประตูทางเข้าของผู้มาสักการะ ตรวจสอบการเปิดวิหารหน้างาน' },
      { h: 'ที่พักใกล้เคียง', p: 'ที่พักเมืองเก่าตอนกลางเหมาะกับการเดินชมวัด อนุสาวรีย์ และพิพิธภัณฑ์ ควรเปรียบเทียบราคาและความสะดวกตามฤดูกาล' },
    ], faqs: [{ q: 'ชื่อวัดอินทขิลสะดือเมืองหมายถึงอะไร?', a: 'หมายถึงบริเวณศูนย์กลางเชิงสัญลักษณ์ของเมือง' }, { q: 'เสาอินทขิลยังอยู่ที่นี่หรือไม่?', a: 'วัดนี้เกี่ยวข้องกับประวัติเดิม ส่วนเสาเมืองในปัจจุบันสัมพันธ์กับวัดเจดีย์หลวง' }, { q: 'เที่ยวกี่นาที?', a: 'ประมาณ 20–40 นาที' }, { q: 'ใกล้อนุสาวรีย์สามกษัตริย์หรือไม่?', a: 'อยู่ใกล้กันในเขตประวัติศาสตร์กลางเมืองเก่า' }],
  },
};
