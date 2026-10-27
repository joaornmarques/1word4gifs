"""Builds js/words.js for 1 Word 4 Gifs.

Each word gets:
  know  1 = universal concept, 2 = mainstream pop culture, 3 = niche / dated
  spell 1 = short & phonetic, 2 = medium or one trap, 3 = long / foreign / tricky
  tag   theme
Usage (from the repo root): python3 tools/build_words.py .
"""
import json, re, sys, unicodedata

DATA = {
    "animals": {
        1: "alligator bear bee bird camel cat chicken cow crab crocodile dog dolphin dove duck elephant fly fox frog "
           "giraffe goat hamster hedgehog hippo horse jaguar kangaroo koala lion lizard lobster monkey mouse otter panda "
           "penguin pig pony rabbit seal shark sheep shrimp sloth snake spider squirrel tiger toad turkey turtle whale "
           "wolf zebra owl octopus parrot flamingo llama dinosaur",
        2: "ferret corgi pug alpaca",
    },
    "food": {
        1: "apple avocado bacon beer broccoli burger cake coffee croissant donut egg milkshake pancakes pineapple pizza "
           "popcorn potato salt waffles watermelon wine sushi taco cupcake",
        2: "shots ramen burrito nachos",
    },
    "sports": {
        1: "ballet chess football golf hockey karate olympics skate squat surf swimming tennis trophy volleyball "
           "wrestling yoga cheerleader",
        2: "badminton dunk fifa gymnastics judo knockout mma nba rally rollerskate touchdown ufc wwe cena",
        3: "champions nhl nutmeg rko wrc",
    },
    "athletes": {
        2: "ali beckham bolt djokovic federer hamilton jordan kobe lebron maradona mayweather mcgregor messi nadal "
           "neymar pele phelps ronaldinho ronaldo schumacher sharapova tyson woods zidane brady curry mbappe",
        3: "agassi ancelotti armstrong barrichello coulthard couture cruijff drogba eusebio gerrard gretzky guardiola "
           "harden hazard kaka klopp lampard lauda maldini malone manning ming mourinho neuer nash nowitzki ozil pirlo "
           "pochettino pogba rossi sarri simeone suarez verstappen vettel westbrook bryant haaland",
    },
    "movies": {
        2: "aladdin avatar bond cinderella dumbo frozen godfather godzilla grinch hangover jaws matrix minions mulan "
           "nemo pinocchio pocahontas rambo rapunzel rocky shrek terminator transformers twilight woody zootopia "
           "incredibles hercules dalmatians stitch ariel et mask zorro frankenstein oscar sparta titanic encanto",
        3: "anchorman borat bourne casablanca corleone exorcist expendables goodfellas hancock hannibal jackass neo "
           "psycho riddick robocop scarface sharknado shining spartacus timon pumbaa dune oppenheimer",
    },
    "sagas": {
        2: "chewbacca frodo gandalf hobbit hogwarts jedi leia skywalker starwars voldemort yoda vader potter grogu",
        3: "anakin legolas smeagol mandalorian",
    },
    "superheroes": {
        2: "aquaman avengers batman deadpool flash hawkeye hulk ironman joker loki marvel spiderman superman thor "
           "wolverine wonderwoman",
        3: "alfred bane daredevil dc deadshot hawkman hellboy manhunter punisher riddler blade",
    },
    "film_people": {
        2: "carrey chaplin clooney cruise depp dicaprio ferrell freeman hanks hemsworth oprah pacino pitt reeves schwarzenegger "
           "spielberg stallone statham streep tarantino travolta nolan hitchcock johansson eastwood atkinson aniston "
           "cumberbatch cage",
        3: "bale bullock coen fincher fonda ford galifianakis gosling gyllenhaal hathaway hopkins kidman kubrick lynch "
           "mcavoy neeson nicholson niro pesci portman sarandon scorsese theron conan",
    },
    "tv": {
        2: "barney csi dexter dora elmo eleven house kardashian kermit muppets narcos office sheldon sherlock "
           "teletubbies thrones wednesday squidgame",
        3: "archer bachelor ross seinfeld supernatural walter",
    },
    "cartoons": {
        2: "bart bender bugs cartman daffy donald dragonball flanders fry futurama garfield goku goofy homer jerry "
           "kenny lisa mickey morty naruto patrick perry pikachu pluto pokemon popeye powerpuff rick scooby scrooge "
           "shaggy simpsons smurfs snoopy spongebob squidward stewie sylvester taz tigger tom tweety vegeta "
           "charizard squirtle piglet flintstones bluey peppa",
        3: "animaniacs bojack bubbles catdog jetsons pinky recess rugrats thomas winx",
    },
    "music": {
        1: "disco dj flute guitar piano rock sax rap",
        2: "acdc adele beatles beyonce bieber bowie britney coldplay drake elvis eminem gorillaz jackson jayz kanye "
           "madonna metallica nickelback nirvana queen rihanna shakira timberlake tupac ymca ariana kpop bruno",
        3: "aerosmith bono cher clapton collins eagles fergie hendrix maroon muse prince radiohead ramones sia "
           "skrillex slash slayer springsteen turner zeppelin psy",
    },
    "games": {
        1: "gaming",
        2: "gameboy gta kirby mario minecraft nintendo pacman playstation sims sonic tetris wii zelda fortnite "
           "roblox amongus kart",
        3: "atari knuckles teemo",
    },
    "internet": {
        1: "bored bye celebrate confused crying cute dance emoji excited eyeroll facepalm fail hug kiss nerd party sad "
           "shocked slap smile weird wink wow yes selfie",
        2: "bro burn dab damn doge feels flirting kawaii loading meh mindblown nope nyan omg pewdiepie rage sassy swag twerk "
           "whatever wtf yolo emo cringe slay sus",
        3: "ksi rekt smosh waddup slenderman vaporwave rizz stonks skibidi",
    },
    "people": {
        1: "jesus obama pope trump einstein",
        2: "bezos buddha gandhi gates mandela merkel picasso putin zuckerberg monalisa musk",
        3: "bernie jobs",
    },
    "brands": {
        1: "google facebook iphone youtube",
        2: "audi barbie bmw chevrolet cocacola disney ferrari honda jeep lamborghini lego mcdonalds mercedes nissan "
           "pepsi porsche samsung tesla volkswagen windows netflix tiktok instagram",
        3: "ibm mclaren timberland",
    },
    "places": {
        1: "beach forest moon mountains ocean space sun",
        2: "australia barcelona berlin brazil china dubai hollywood japan lisbon london madrid miami moscow paris "
           "texas tokyo",
        3: "manchester milan roma",
    },
    "things": {
        1: "abs airplane angel award baby battery beard bicycle boat bomb bubble bus chair christmas clock cloud "
           "computer cowboy cup dice drunk easter explosion eye eyebrow feet fireworks flag ghost glasses graduation "
           "hair halloween hammer helicopter kids lava magic math money motorcycle moustache mummy ninja nun phone "
           "police puppet rain rainbow ring robot rocket sailboat sleep smoke snow spaceship spy stars submarine "
           "sunglasses table tank taxi tornado train trash ufo unicorn van vampire water werewolf wheel wind witch "
           "wizard yacht zombie alien dragon melt nature neon victory comet wallet",
        2: "geyser graffiti hanukkah hovercraft pixels retro saturn vhs drone",
    },
}

# Only used when the player turns on adult mode (18+) at the start. Giphy rating becomes "r".
ADULT = {
    1: "boobs dick naked weed drugs liquor hell bitch sexy vodka tequila",
    2: "shrooms beerpong stripper",
}

# Also accepted as correct: Portuguese translations (PT-PT and common PT-BR) and frequent misspellings.
# Accents, spaces and hyphens are ignored when comparing, so "arco-íris" matches "arcoiris".
ALT = """
alligator: jacaré | bear: urso | bee: abelha | bird: pássaro, ave | camel: camelo | cat: gato
chicken: galinha, frango | cow: vaca | crab: caranguejo | crocodile: crocodilo | dog: cão, cachorro
dolphin: golfinho | dove: pomba | duck: pato | elephant: elefante | fly: mosca | fox: raposa | frog: rã, sapo
giraffe: girafa | goat: cabra | hedgehog: ouriço | hippo: hipopótamo | horse: cavalo | jaguar: onça
kangaroo: canguru | koala: coala | lion: leão | lizard: lagarto, osga | lobster: lagosta | monkey: macaco
mouse: rato | otter: lontra | penguin: pinguim | pig: porco | pony: pónei, pônei | rabbit: coelho | seal: foca
shark: tubarão | sheep: ovelha | shrimp: camarão | sloth: preguiça | snake: cobra, serpente | spider: aranha
squirrel: esquilo | tiger: tigre | toad: sapo | turkey: peru | turtle: tartaruga | whale: baleia | wolf: lobo
owl: coruja, mocho | octopus: polvo | parrot: papagaio | llama: lama | dinosaur: dinossauro | ferret: furão
apple: maçã | avocado: abacate | beer: cerveja | broccoli: brócolos, brócolis | burger: hambúrguer
cake: bolo | coffee: café | croissant: cruassã | donut: dónute | egg: ovo | pancakes: panquecas, panqueca
pineapple: ananás, abacaxi | popcorn: pipocas, pipoca | potato: batata | salt: sal | waffles: waffle
watermelon: melancia | wine: vinho | shots: shot
ballet: bailado, balé | chess: xadrez | football: futebol | golf: golfe | hockey: hóquei | olympics: olímpicos, olimpíadas
squat: agachamento | swimming: natação | tennis: ténis, tênis | trophy: troféu, taça | volleyball: voleibol, vólei
wrestling: luta | yoga: ioga | dunk: afundanço | gymnastics: ginástica | knockout: ko, nocaute | rally: rali
rollerskate: patins, patinagem | disco: discoteca | flute: flauta | guitar: guitarra, violão | sax: saxofone
bored: aborrecido, entediado, tédio | bye: adeus, tchau, xau | celebrate: celebrar, festejar | confused: confuso
crying: chorar, choro | cute: fofo, querido | dance: dançar, dança | excited: entusiasmado, animado
fail: falhar, falha | hug: abraço | kiss: beijo | party: festa | sad: triste | shocked: chocado
slap: estalo, bofetada, chapada | smile: sorriso, sorrir | weird: estranho | wink: piscadela, piscar | yes: sim
bro: mano | flirting: namoriscar | loading: a carregar, carregando | nope: não | rage: raiva, fúria | whatever: tanto faz
pope: papa | buddha: buda | gandhi: ghandi | monalisa: gioconda
beach: praia | forest: floresta | moon: lua | mountains: montanhas, montanha | ocean: oceano, mar | space: espaço
sun: sol | australia: austrália | berlin: berlim | brazil: brasil | japan: japão | lisbon: lisboa | london: londres
moscow: moscovo, moscou | tokyo: tóquio | milan: milão
abs: abdominais | airplane: avião | angel: anjo | award: prémio, prêmio | baby: bebé, bebê | battery: bateria, pilha
beard: barba | bicycle: bicicleta | boat: barco | bomb: bomba | bubble: bolha | bus: autocarro, ônibus
chair: cadeira | christmas: natal | clock: relógio | cloud: nuvem | computer: computador | cup: taça, copa, chávena
dice: dados, dado | drunk: bêbado | easter: páscoa | explosion: explosão | eye: olho | eyebrow: sobrancelha
feet: pés | fireworks: fogo de artifício | flag: bandeira | ghost: fantasma | glasses: óculos
graduation: graduação, formatura | hair: cabelo | hammer: martelo | helicopter: helicóptero | kids: crianças, miúdos
magic: magia | math: matemática | money: dinheiro | motorcycle: mota, moto | moustache: bigode | mummy: múmia
nun: freira | phone: telemóvel, telefone, celular | police: polícia | puppet: fantoche, marioneta | rain: chuva
rainbow: arco-íris | ring: anel | robot: robô | rocket: foguetão, foguete | sailboat: veleiro | smoke: fumo, fumaça
snow: neve | spaceship: nave, nave espacial | spy: espião | stars: estrelas | submarine: submarino
sunglasses: óculos de sol | table: mesa | tank: tanque | trash: lixo | train: comboio, trem | ufo: ovni
unicorn: unicórnio | van: carrinha | vampire: vampiro | water: água | werewolf: lobisomem | wheel: roda | wind: vento
witch: bruxa | wizard: feiticeiro, mago | yacht: iate | zombie: zumbi | alien: extraterrestre, alienígena
dragon: dragão | melt: derreter | nature: natureza | victory: vitória | comet: cometa | wallet: carteira
saturn: saturno | pixels: píxeis | geyser: géiser
jaws: tubarão | godfather: padrinho | hangover: ressaca | incredibles: incríveis | dalmatians: dálmatas
cinderella: cinderela | pinocchio: pinóquio | aladdin: aladino | zootopia: zootrópolis | terminator: exterminador
sparta: esparta | oscar: óscar | hercules: hércules | mask: máscara | avengers: vingadores
spiderman: homem-aranha | ironman: homem de ferro | wonderwoman: mulher-maravilha | starwars: guerra das estrelas
spongebob: bob esponja | scrooge: patinhas, tio patinhas | goofy: pateta | tweety: piu-piu | sylvester: silvestre
smurfs: estrumpfes | daffy: patolino | piglet: leitão | flintstones: flintstone | simpsons: simpson
boobs: mamas | dick: pila | naked: nu, nua | weed: erva, marijuana | drugs: drogas | liquor: licor
hell: inferno | shrooms: cogumelos
"""

# Old word -> new word (spelling fixes and normalisations).
RENAMED = {
    "aligator": "alligator", "cofee": "coffee", "girafe": "giraffe", "hipo": "hippo", "mumy": "mummy",
    "nitendo": "nintendo", "nisan": "nissan", "bubles": "bubbles", "maddona": "madonna", "flinstone": "flintstones",
    "ghandi": "gandhi", "pochetino": "pochettino", "buda": "buddha", "londres": "london", "sunglass": "sunglasses",
    "nickleback": "nickelback", "pumba": "pumbaa", "scoobydoo": "scooby", "simpson": "simpsons", "clouds": "cloud", "ko": "knockout",
    "girafe": "giraffe",
}

# Old words dropped, with the reason.
REMOVED = {
    # (bitch dick boobs naked drugs shrooms weed liquor hell moved to ADULT)
    "offensive / identity-based": "lesbian fat furry russian terror gun shotgun god",
    "abstract / ambiguous": "no up who why high great small later secret please help work wild win wonder lord "
                            "master human thing design designer soul silence luck danger loop captain america "
                            "james justin jimmy smith liam jake zac han mac chip court cream bob hp stone rolling "
                            "breaking lost vision shield king saw wall president pink fast clarkson hammond",
    "impossible to type": "o'neil formula1 sense8",
}

SPELL_OVERRIDE = {
    # foreign or non-phonetic, harder than their length suggests
    "cruijff": 3, "neuer": 2, "ozil": 2, "eusebio": 3, "gyllenhaal": 3, "galifianakis": 3, "nowitzki": 3,
    "schumacher": 3, "schwarzenegger": 3, "verstappen": 3, "barrichello": 3, "coulthard": 3, "ancelotti": 3,
    "pochettino": 3, "zuckerberg": 3, "cumberbatch": 3, "chewbacca": 3, "pumbaa": 3, "kawaii": 2, "beyonce": 2,
    "rihanna": 2, "yacht": 3, "giraffe": 2, "hippo": 2, "broccoli": 3, "croissant": 3, "moustache": 3,
    "eyebrow": 2, "acdc": 2, "jayz": 2, "ymca": 2, "skibidi": 2, "hanukkah": 3, "gandhi": 3, "buddha": 2,
    "einstein": 2, "pikachu": 2, "naruto": 1, "goku": 1, "hobbit": 1, "kpop": 2, "kardashian": 2,
    "mcdonalds": 3, "lamborghini": 3, "volkswagen": 3, "chevrolet": 3, "porsche": 2, "seinfeld": 2,
    "nickelback": 2, "aerosmith": 2, "springsteen": 3, "hendrix": 2, "skrillex": 2, "nietzsche": 3,
    "mourinho": 3, "guardiola": 2, "djokovic": 3, "sharapova": 2, "mayweather": 3, "mcgregor": 2,
    "ronaldinho": 3, "neymar": 2, "phelps": 2, "tyson": 2, "rhythm": 3, "pewdiepie": 3, "doge": 1,
    "wednesday": 3, "oppenheimer": 3, "mandalorian": 3, "squidgame": 2, "amongus": 2,
}

ADULT_OLD = "bitch dick boobs naked drugs shrooms weed liquor hell".split()

TRICKY = re.compile(r"(.)\1|ph|gh|kn|wr|sch|ij|aa|ii|uu|ae|eau|y[^$]|[qxzj]")


def spell(word, tag):
    if word in SPELL_OVERRIDE:
        return SPELL_OVERRIDE[word]
    n = len(word)
    score = 0 if n <= 4 else 1 if n <= 6 else 2 if n <= 8 else 3 if n <= 10 else 4
    score += min(2, len(TRICKY.findall(word)))
    if tag in ("athletes", "film_people", "people") and n >= 6:
        score += 1
    return 1 if score <= 1 else 2 if score <= 3 else 3


def normalise(text):
    plain = unicodedata.normalize("NFD", text.lower())
    return re.sub(r"[^a-z0-9]", "", plain)


def parse_alt():
    alt = {}
    for chunk in re.split(r"[|\n]", ALT):
        if ":" not in chunk:
            continue
        word, options = chunk.split(":", 1)
        alt.setdefault(word.strip(), []).extend(normalise(o) for o in options.split(","))
    for old, new in RENAMED.items():  # old misspellings keep counting as correct
        alt.setdefault(new, []).append(old)
    return alt


def main(repo):
    words, seen = [], {}
    data = dict(DATA, adult=ADULT)
    for tag, levels in data.items():
        for know, blob in levels.items():
            for w in blob.split():
                if w in seen:
                    raise SystemExit(f"duplicate: {w} in {tag} and {seen[w]}")
                if not re.fullmatch(r"[a-z]+", w):
                    raise SystemExit(f"not typeable: {w}")
                seen[w] = tag
                words.append({"w": w, "spell": spell(w, tag), "know": know, "tag": tag})

    alt = parse_alt()
    unknown = sorted(set(alt) - set(seen))
    if unknown:
        raise SystemExit("ALT entries for words not in the base: " + " ".join(unknown))
    for x in words:
        options = sorted({o for o in alt.get(x["w"], []) if o and o != x["w"]})
        if options:
            x["alt"] = options
        if x["tag"] == "adult":
            x["adult"] = True

    # The 2017/2019 lists (js/keys.js, js/palavras.js) were migrated into DATA above.
    # If they are present, check that every old word was kept, renamed or removed on purpose.
    import os
    old_files = [f"{repo}/js/keys.js", f"{repo}/js/palavras.js"]
    old = set()
    if all(os.path.exists(f) for f in old_files):
        src = open(old_files[0]).read().split("var message_win")[0] + open(old_files[1]).read()
        old = {w.strip().lower() for w in re.findall(r'"([^"]+)"', src)}
    removed = {w for blob in REMOVED.values() for w in blob.split()} | set(ADULT_OLD)
    missing = sorted(w for w in old if w not in seen and RENAMED.get(w) not in seen and w not in removed)
    if missing:
        raise SystemExit("unaccounted old words: " + " ".join(missing))
    added = sorted(w for w in seen if old and w not in old and w not in RENAMED.values())

    words.sort(key=lambda x: (x["tag"], x["know"], x["w"]))
    lines = ",\n".join("    " + json.dumps(x, separators=(", ", ": ")) for x in words)
    out = f"""// 1 Word 4 Gifs word base. Generated by tools/build_words.py, edit there.
//   know  1 universal, 2 mainstream pop culture, 3 niche or dated
//   spell 1 short and phonetic, 2 medium or one trap, 3 long, foreign or tricky
//   level (used by the game) = 1 if know+spell <= 3, 2 if 4, 3 if >= 5
//   alt   also accepted: Portuguese translations and common misspellings (already normalised)
//   adult only shown in adult mode
var WORDS = [
{lines}
];
"""
    open(f"{repo}/js/words.js", "w").write(out)

    lvl = lambda x: 1 if x["spell"] + x["know"] <= 3 else 2 if x["spell"] + x["know"] == 4 else 3
    from collections import Counter
    print("total", len(words), "| old", len(old), "| removed", len(removed & old), "| added", len(added))
    print("level", dict(sorted(Counter(map(lvl, words)).items())))
    print("know", dict(sorted(Counter(x["know"] for x in words).items())),
          "spell", dict(sorted(Counter(x["spell"] for x in words).items())))
    print("added:", " ".join(added))
    print("with alt:", sum(1 for x in words if "alt" in x), "| adult:", sum(1 for x in words if x.get("adult")))
    for s in (1, 2, 3):
        print(f"spell {s} sample:", " ".join(x["w"] for x in words if x["spell"] == s)[:400])


if __name__ == "__main__":
    main(sys.argv[1])
