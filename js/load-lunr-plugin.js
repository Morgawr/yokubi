// Modified version of this code:
// https://github.com/rust-lang/mdBook/issues/1081#issuecomment-2030246067

// Required for `elasticlunr.multiLanguage()` to work.
// This is something lunr.jp should implement
// but it doesn't.
// copied from: https://github.com/MihaiValentin/lunr-languages/blob/master/lunr.ja.js
elasticlunr.jp.wordCharacters = "一二三四五六七八九十百千万億兆一-龠々〆ヵヶぁ-んァ-ヴーｱ-ﾝﾞa-zA-Zａ-ｚＡ-Ｚ0-9０-９";

var re_ENchar = new RegExp("[" + elasticlunr.wordCharacters + "]")

// Patch load method, which is used by searcher.js.
// This swaps the prebuilt index with a new index 
// that supports JP keyword search.
// Since this happens on client side, it may increase load time.
elasticlunr.Index.load = function (index) {
    // `index` contains the index built by mdbook during build.
    // It also contains all raw page texts so we'll use them
    // to rebuild a new index.

    return elasticlunr(function () {
        this.use(elasticlunr.multiLanguage('en', 'jp'));

        var en_tokenizer = elasticlunr.tokenizer;

        // first tokenize with the English tokenizer, and then 
        // only apply the Japanese tokenizer on tokens that 
        // don't look like English.
        //
        // Why should we not use just the JP tokenizer?
        // Because a query like "they're" would be 
        // tokenized into "they" and "re" and 
        // EN stopWordFilter removes "they" and 
        // you're left with "re" which would match
        // any words that start with re.
        elasticlunr.tokenizer = function (obj) {
            var result = [];
            var en_tokens = en_tokenizer(obj);
            for (var i = 0; i < en_tokens.length; i++) {
                if (en_tokens[i].match(re_ENchar)) {
                    result.push(en_tokens[i]);
                } else {
                    var jp_tokens = elasticlunr.jp.tokenizer(en_tokens[i]);
                    result.push.apply(result, jp_tokens);
                }
            }
            return result;
        };

        // At least the `seperator` property is required for
        // EN tokenizer to work correctly
        for (var prop in en_tokenizer) {
            elasticlunr.tokenizer[prop] = en_tokenizer[prop]
        }

        // fields to index
        this.addField('title');
        this.addField('body');
        this.addField('breadcrumbs');
    
        // Identify documents field
        this.setRef('id');
        
        // Build index of all pages
        for (let key in index.documentStore.docs) {
            this.addDoc(index.documentStore.docs[key]);
        }
    });
};
