// Poses del personaje: nombre del botón, frase que dice, tamaño del recorte y puntos de la cara.
// Para cambiar una frase, edita "phrase". Para cambiar una imagen, reemplaza el archivo en img/poses/.
const POSES={
 standing:{label:"De pie",   phrase:"Pasa, no muerdo. Casi nunca."},
 peace:   {label:"Paz",      phrase:"Escríbeme. Contesto hasta de madrugada."},
 sadbust: {label:"Pensando", phrase:"Esto salió entre builds fallidos y café."},
 crossed: {label:"Serio",    phrase:"Años de apps. Pregúntame por cualquiera."},
 pocket:  {label:"Relajado", phrase:"Tengo tiempo, pásale."},
 sitblock:{label:"Sentado",  phrase:"Siéntate. Te cuento cómo lidero."},
 walk:    {label:"Caminando",phrase:"Voy rumbo a algo genial."},
 back:    {label:"De lado",  phrase:"No mires… me estoy inspirando."},
 drink:   {label:"Brindis",  phrase:"¡Un brindis por tus ideas!"},
 lying:   {label:"Echado",   phrase:"Las mejores ideas llegan desde el piso."},
 profile: {label:"Perfil",   phrase:"Hmm… déjame pensarlo."},
 cat:     {label:"Con gato", phrase:"Mi mejor compañero de trabajo."},
 hug:     {label:"Rodillas", phrase:"Un día largo, pero aquí sigo."}
};
const ORDER=["standing","peace","sadbust","crossed","pocket","sitblock","walk","back","drink","lying","profile","cat","hug"];
const BUST=new Set(["peace","crossed","sadbust","pocket","profile"]);   // recortadas al pecho: se desvanecen abajo

const DATA={
 "standing": {"w": 227, "h": 711, "src": "img/poses/standing.webp", "face": {"m": [105, 148, 9], "e": [[77, 111, 15, 10], [126, 109, 14, 10]], "skin": "#ecd0bb"}},
 "sitblock": {"w": 305, "h": 509, "src": "img/poses/sitblock.webp"},
 "back": {"w": 190, "h": 477, "src": "img/poses/back.webp"},
 "walk": {"w": 236, "h": 526, "src": "img/poses/walk.webp"},
 "peace": {"w": 240, "h": 401, "src": "img/poses/peace.webp", "face": {"m": [137, 190, 16], "e": [[107, 154, 19, 14], [161, 151, 19, 14]], "skin": "#edd0be", "imgs": {"abierta": {"src": "img/poses/peace-boca-abierta.webp", "x": 88.4, "y": 158.8, "w": 88, "h": 72}, "o": {"src": "img/poses/peace-boca-o.webp", "x": 88.4, "y": 158.8, "w": 88, "h": 72}}}},
 "crossed": {"w": 214, "h": 395, "src": "img/poses/crossed.webp", "face": {"m": [100, 174, 11], "e": [[85, 132, 16, 11], [135, 141, 15, 11]], "skin": "#ead0bc"}},
 "sadbust": {"w": 246, "h": 348, "src": "img/poses/sadbust.webp", "face": {"m": [124, 194, 12], "e": [[93, 152, 18, 11], [151, 148, 16, 11]], "skin": "#e8d2be"}},
 "drink": {"w": 267, "h": 377, "src": "img/poses/drink.webp"},
 "lying": {"w": 419, "h": 294, "src": "img/poses/lying.webp"},
 "pocket": {"w": 170, "h": 377, "src": "img/poses/pocket.webp", "face": {"m": [85, 122, 7], "e": [[66, 94, 13, 9], [105, 93, 11, 9]], "skin": "#e6ccbc"}},
 "profile": {"w": 230, "h": 364, "src": "img/poses/profile.webp"},
 "cat": {"w": 287, "h": 350, "src": "img/poses/cat.webp"},
 "hug": {"w": 323, "h": 344, "src": "img/poses/hug.webp"}
};   // recortes de la hoja + puntos de cara

const OK=new Set();   // poses cuya imagen sí cargó (lo llena avatar.js)
