// Modified version of this code:
// https://github.com/rust-lang/mdBook/issues/1081#issuecomment-2030246067
//
// Patch load method wwhich is used by searcher.js in order to swap the prebuilt index
// with a new index that supports JP keyword search.
// Since this will re-build index on clident side, it may increase load time.

elasticlunr.Index.load = function (index) {
    return elasticlunr(function () {
        this.use(elasticlunr.jp);

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
