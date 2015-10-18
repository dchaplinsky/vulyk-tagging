import sys
import re
import json

from glob2 import glob

MAPPING = {
    "noun": "post",
    "pron": "post",
    "verb": "post",
    "adj": "post",
    "adjp": "post",
    "adv": "post",
    "advp": "post",
    "prep": "post",
    "predic": "post",
    "insert": "post",
    "conj": "post",
    "part": "post",
    "excl": "post",
    "numr": "post",
    "p": "nmbr",
    "s": "nmbr",
    "m": "gndr",
    "f": "gndr",
    "n": "gndr",
    "1": "PErs",
    "2": "PErs",
    "3": "PErs",
    "v_naz": "CAse",
    "v_rod": "CAse",
    "v_dav": "CAse",
    "v_zna": "CAse",
    "v_oru": "CAse",
    "v_mis": "CAse",
    "v_kly": "CAse",
    "np": "tantum",
    "ns": "tantum",
    "rv_naz": "req_case",
    "rv_rod": "req_case",
    "rv_dav": "req_case",
    "rv_zna": "req_case",
    "rv_oru": "req_case",
    "rv_mis": "req_case",
    "futr": "tense",
    "past": "tense",
    "pres": "tense",
    "impr": "mood",
    "inf": "verb_type",
    "impers": "verb_type",
    "actv": "voice",
    "pasv": "voice",
    "subord": "conj_type",
    "coord": "conj_type",
    "perf": "aspc",
    "imperf": "aspc",
    "tran": "trns",
    "intran": "trns",
    "compb": "forms",
    "compr": "forms",
    "super": "forms",
    "anim": "ANim",
    "inanim": "ANim",
    "nv": "aux",
    "bad": "aux",
    "rev": "aux",
    "rare": "aux",
    "v-u": "aux",
    "abbr": "aux",
    "coll": "aux",
    "slang": "aux",
    "unknown": "aux",
    "pers": "aux",
    "alt": "aux",
    "init": "aux",
    "fname": "aux",
    "lname": "aux",
    "patr": "aux",


    "number": "aux",
    "dem": "aux",
    "int": "aux",
    "rel": "aux",
    "pos": "aux",
    "def": "aux",
    "ind": "aux",
    "refl": "aux",
    "neg": "aux",
    "gen": "aux",
    "contr": "aux",
    "time": "aux",
    "&pron": "aux",

    # Will be removed later
    "&adj": "aux",
    "phras": "aux",
}

BUG_FIXES = {
    # "&pron": "pron",
    # "<adv>": "adv",
    # "</adv>": "adv",
    # "<insert>": "insert",
    # "</insert>": "insert",
    # "<prep": "prep",
    # "</prep": "prep",
    # "&adjp": "adjp",
    # "&adj": "adjp",
    # "rv_oru>": "rv_oru",
}


def parse_file(content):
    matches = re.findall("<S>(.*)<\/S>", content)

    print("%s: %s" % (f, len(matches)))

    for m in matches:
        sentence = []
        word_forms = re.findall("([^[]*)\[([^]]*)\]", m)

        for word, tags_raw in word_forms:
            tag_options = []
            if "/punct" not in tags_raw:
                tags = re.findall("([^/]+)\/([^,]+),*", tags_raw)
                for tag in tags:
                    tag_details = filter(
                        lambda x: x not in ["punct", "null", ""],
                        tag[1].split(":"))

                    try:
                        tag_details = map(
                            lambda x: [BUG_FIXES.get(x, x),
                                       MAPPING[BUG_FIXES.get(x, x)]],
                            tag_details)
                    except KeyError:
                        print("%s: %s" % (word, tag_details))

                    tag_options.append([tag[0], tag_details])

                sentence.append([word.strip(), tag_options])
            else:
                sentence.append([word.strip(), False])

        if sentence:
            yield {"sentence": sentence}


if __name__ == '__main__':
    if len(sys.argv) < 3:
        exit("Not enough arguments")

    with open(sys.argv[2], "w") as f_out:
        for f in glob(sys.argv[1]):
            with open(f, "r") as fp:
                for sentence in parse_file(fp.read()):
                    f_out.write(json.dumps(sentence, ensure_ascii=False)
                                + "\n")
