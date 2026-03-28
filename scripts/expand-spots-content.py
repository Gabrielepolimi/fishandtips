#!/usr/bin/env python3
"""
Expand fishing-spots.json descriptions from ~25 words to 80-100 words.
"""
import json
import random
import os

random.seed(42)

ENVIRONMENT_DETAILS = {
    "Scogliera granitica": {
        "seabed_extra": "Le formazioni granitiche creano anfratti e tane naturali dove i predatori si rifugiano",
        "uniqueness": "i massi granitici levigati dal vento e dal mare formano piscine naturali e canali dove il pesce si concentra",
        "seasonal": "D'inverno le mareggiate smuovono il fondale rendendo la zona particolarmente produttiva, mentre in estate l'acqua cristallina permette avvistamenti a vista",
    },
    "Scogliera calcarea": {
        "seabed_extra": "Il calcare eroso dall'acqua crea cavità, grotte e sottosquadri perfetti per saraghi e cernie",
        "uniqueness": "le pareti calcaree sommerse ricche di anfratti offrono rifugio a un'enorme varietà di specie stanziali",
        "seasonal": "In primavera le alghe ricoprono le rocce attirando erbivori come salpe e cefali, in autunno i predatori dominano la scena",
    },
    "Spiaggia sabbiosa": {
        "seabed_extra": "Il fondale sabbioso degradante crea canalette e buche dove si concentrano mormore, sogliole e orate",
        "uniqueness": "la conformazione del fondale con alternanza di secche e buche rende ogni sessione diversa dalla precedente",
        "seasonal": "L'inverno è la stagione regina per il surfcasting su questo tipo di spiaggia, con sogliole e mormore in risacca. In estate si sposta l'azione verso le ore notturne",
    },
    "Porto": {
        "seabed_extra": "Le strutture portuali — moli, banchine e massi di protezione — creano un ecosistema artificiale ricchissimo",
        "uniqueness": "la concentrazione di nutrimento e riparo nelle strutture portuali attira pesce durante tutto l'anno",
        "seasonal": "In inverno il porto diventa rifugio per spigole e cefali, in estate orate e saraghi stazionano lungo le banchine",
    },
    "Scogliera a picco": {
        "seabed_extra": "La profondità raggiunta a pochi metri dalla riva permette di insidiare specie normalmente accessibili solo dalla barca",
        "uniqueness": "il rapido digradare del fondale concentra pesci di taglia a distanza di lancio",
        "seasonal": "Le scogliere a picco danno il meglio in autunno e inverno quando le mareggiate spingono i predatori sotto le pareti",
    },
    "Foce": {
        "seabed_extra": "La mescolanza di acqua dolce e salata crea un ambiente unico ricco di nutrienti che attira diverse specie",
        "uniqueness": "le foci rappresentano zone di alimentazione primarie dove l'acqua dolce porta nutrimento dal fiume",
        "seasonal": "Dopo le piogge autunnali la foce diventa un magnete per spigole e cefali. In primavera le seppie si avvicinano per la riproduzione",
    },
    "Molo": {
        "seabed_extra": "I massi alla base del molo creano tane e anfratti che ospitano una comunità marina stabile e variegata",
        "uniqueness": "la facilità di accesso combinata con la profondità raggiungibile lo rende ideale per principianti e esperti",
        "seasonal": "Produttivo tutto l'anno con picchi in primavera per le seppie e in autunno per i calamari e le spigole",
    },
    "Scogliera bassa": {
        "seabed_extra": "Le piattaforme rocciose a pelo d'acqua creano zone di frangente dove i pesci cacciano attivamente",
        "uniqueness": "la scogliera bassa permette di pescare comodamente accedendo a fondali misti sabbia-roccia molto produttivi",
        "seasonal": "In estate la scogliera bassa è perfetta per il rock fishing leggero, in inverno per il bolentino e lo spinning",
    },
    "Scogliera lavica": {
        "seabed_extra": "La roccia vulcanica crea formazioni irregolari e porose ricche di anfratti dove si rifugiano polpi, saraghi e cernie",
        "uniqueness": "i fondali lavici ospitano una biodiversità unica grazie alla struttura porosa della roccia che funge da reef naturale",
        "seasonal": "D'estate l'acqua calda attira specie termofile come barracuda e lecce, in inverno le spigole dominano gli anfratti lavici",
    },
    "Laguna": {
        "seabed_extra": "I fondali bassi e fangosi della laguna sono ricchissimi di nutrienti e ospitano nursery di molte specie marine",
        "uniqueness": "l'ambiente lagunare con le sue maree crea condizioni di pesca uniche con pesci che seguono il ritmo delle acque",
        "seasonal": "In autunno la laguna è il paradiso per anguille e cefali, in primavera le orate e le spigole entrano per alimentarsi",
    },
    "Diga foranea": {
        "seabed_extra": "I massi della diga fungono da reef artificiale creando un ecosistema ricchissimo sia sulla superficie che sott'acqua",
        "uniqueness": "la diga concentra il pesce in uno spazio ridotto offrendo accesso a specie di fondo, mezzacqua e superficie",
        "seasonal": "In inverno le spigole stazionano alla base dei massi, in estate i pelagici passano a portata di lancio dalla testata",
    },
    "Piattaforma rocciosa": {
        "seabed_extra": "Le piattaforme calcaree sommerse creano cadute di profondità e zone di corrente che attirano branchi di pesci",
        "uniqueness": "i bordi della piattaforma dove la roccia incontra la sabbia sono punti chiave dove si concentra l'attività predatoria",
        "seasonal": "Le piattaforme danno il meglio tra primavera e autunno, quando la temperatura stimola l'attività delle specie stanziali",
    },
}

DEFAULT_ENV = {
    "seabed_extra": "Il fondale vario crea un ambiente ricco dove diverse specie trovano rifugio e alimentazione",
    "uniqueness": "la varietà di strutture sommerse rende questo spot interessante durante tutto l'anno",
    "seasonal": "Le condizioni cambiano significativamente tra estate e inverno, offrendo target diversi in ogni stagione",
}


def expand_spot_description(spot, region_name):
    seed = f"spot_{spot['id']}_{spot.get('region', '')}"
    rng = random.Random(seed)

    existing = spot["description"]
    env = spot.get("environment", "")
    seabed = spot.get("seabed", "misto")
    depth = spot.get("depth", "variabile")
    name = spot["name"]
    locality = spot.get("locality", "")

    env_data = ENVIRONMENT_DETAILS.get(env, DEFAULT_ENV)
    seabed_extra = env_data["seabed_extra"]
    uniqueness = env_data["uniqueness"]
    seasonal = env_data["seasonal"]

    species_names = [s["name"] for s in spot.get("species", [])[:4]]
    species_text = ", ".join(species_names[:-1]) + f" e {species_names[-1]}" if len(species_names) > 1 else species_names[0] if species_names else "diverse specie"

    top_tech = ""
    if spot.get("techniques"):
        best = max(spot["techniques"], key=lambda t: t.get("rating", 0))
        top_tech = best.get("name", "")

    tips = spot.get("tips", [])
    first_tip = tips[0] if tips else ""

    access_note = ""
    if spot.get("access", {}).get("difficulty"):
        diff = spot["access"]["difficulty"]
        if diff.lower() in ["facile", "easy"]:
            access_note = "L'accesso facile lo rende adatto anche a famiglie e principianti."
        elif diff.lower() in ["media", "medium"]:
            access_note = "L'accesso richiede un minimo di preparazione ma è alla portata della maggior parte dei pescatori."
        elif diff.lower() in ["difficile", "hard", "impegnativa"]:
            access_note = "L'accesso impegnativo scoraggia i meno motivati, ma chi arriva trova spesso lo spot libero e produttivo."
        else:
            access_note = f"L'accesso è {diff.lower()}, da valutare in base alla propria esperienza."

    templates = [
        f"{existing} {seabed_extra}. Il fondale, caratterizzato da {seabed.lower()}, raggiunge profondità di {depth}. Ciò che rende {name} unico è {uniqueness}. Le specie principali — {species_text} — trovano qui condizioni ideali. {seasonal}. {access_note} {f'La tecnica più efficace è il {top_tech.lower()}.' if top_tech else ''} {first_tip}",
        f"{existing} Con un fondale di {seabed.lower()} e profondità fino a {depth}, questo spot attira {species_text} durante gran parte dell'anno. {seabed_extra}. {uniqueness.capitalize()} — ecco perché {name} è un riferimento per i pescatori della zona. {seasonal}. {access_note} {first_tip}",
        f"{existing} Il fondale è composto da {seabed.lower()} con profondità che arrivano a {depth}, creando un ambiente perfetto per {species_text}. {seabed_extra}. Rispetto agli altri spot della zona, {uniqueness}. {seasonal}. {access_note} {f'Chi viene qui per la prima volta dovrebbe privilegiare il {top_tech.lower()}.' if top_tech else ''}",
    ]

    result = rng.choice(templates)
    # Clean up double spaces
    while "  " in result:
        result = result.replace("  ", " ")
    return result.strip()


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "..", "data", "fishing-spots.json")

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    for region in data["regions"]:
        for spot in region["spots"]:
            spot["description"] = expand_spot_description(spot, region["name"])
            updated += 1

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated} spot descriptions")

    # Show averages
    words = [len(s["description"].split()) for r in data["regions"] for s in r["spots"]]
    print(f"Avg description: {sum(words)/len(words):.0f} words (min: {min(words)}, max: {max(words)})")


if __name__ == "__main__":
    main()
