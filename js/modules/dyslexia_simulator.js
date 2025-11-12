(function () {
    "use strict";
    document.addEventListener('DOMContentLoaded', function () {
        var getTextNodesIn = function (el) {
            var textNodes = [];
            var walker = document.createTreeWalker(
                el,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function (node) {
                        var parent = node.parentElement;

                        while (parent) {
                            var tagName = parent.tagName.toUpperCase();

                            if (tagName === 'SCRIPT' || tagName === 'IFRAME') {
                                return NodeFilter.FILTER_REJECT;
                            }

                            parent = parent.parentElement;
                        }

                        if (node.nodeValue.trim() === '') {
                            return NodeFilter.FILTER_REJECT;
                        }

                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );

            var node;
            while ((node = walker.nextNode())) {
                textNodes.push(node);
            }

            return textNodes;
        };

        var targetElement = document.getElementById('dyslexia-simulation');

        if (!targetElement) {
            console.error("Script Error: Could not find element with ID dyslexia-simulation");
            return;
        }

        var textNodes = getTextNodesIn(targetElement);


        var wordsInTextNodes = [];
        for (var i = 0; i < textNodes.length; i++) {
            var node = textNodes[i];
            var words = []
            var re = /\p{L}+/gu;
            var match;

            while ((match = re.exec(node.nodeValue)) != null) {
                var word = match[0];
                var position = match.index;

                words.push({
                    length: word.length,
                    position: position
                });
            }

            wordsInTextNodes[i] = words;
        };


        function messUpWords() {
            for (var i = 0; i < textNodes.length; i++) {
                var node = textNodes[i];

                for (var j = 0; j < wordsInTextNodes[i].length; j++) {
                    if (Math.random() > 1 / 10) {
                        continue;
                    }

                    var wordMeta = wordsInTextNodes[i][j];
                    var word = node.nodeValue.slice(wordMeta.position, wordMeta.position + wordMeta.length);
                    var before = node.nodeValue.slice(0, wordMeta.position);
                    var after = node.nodeValue.slice(wordMeta.position + wordMeta.length);

                    node.nodeValue = before + messUpWord(word) + after;
                };
            };
        }

        function messUpWord(word) {
            if (word.length < 3) {
                return word;
            }

            return word[0] + messUpMessyPart(word.slice(1, -1)) + word[word.length - 1];
        }

        function messUpMessyPart(messyPart) {
            if (messyPart.length < 2) {
                return messyPart;
            }

            var a, b;
            while (!(a < b)) {

                a = getRandomInt(0, messyPart.length - 1);
                b = getRandomInt(0, messyPart.length - 1);
            }

            return messyPart.slice(0, a) + messyPart[b] + messyPart.slice(a + 1, b) + messyPart[a] + messyPart.slice(b + 1);
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        setInterval(messUpWords, 150);

    });
})();