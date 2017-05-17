var _user$project$Native_Jsonify = (function() {
    function forceThunks(vNode) {
        if (typeof vNode !== 'undefined' && vNode.type === 'thunk' && !vNode.node) {
            vNode.node = vNode.thunk.apply(vNode.thunk, vNode.args);
        }
        if (typeof vNode !== 'undefined' && typeof vNode.children !== 'undefined') {
            vNode.children = vNode.children.map(forceThunks);
        }
        if (typeof vNode !== 'undefined' && vNode.type === 'tagger') {
            vNode.node = forceThunks(vNode.node);
        }
        return vNode;
    }

    return {
        toJson: function(html) {
            return forceThunks(html);
        },
    };
})();