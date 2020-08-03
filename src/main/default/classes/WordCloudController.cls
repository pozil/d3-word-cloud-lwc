public with sharing class WordCloudController {
    @AuraEnabled(cacheable=true)
    public static List<Word> getWords() {
        // TODO: call external server to retrieve list of words
        return new List<Word>{
            new Word('Running', 10),
            new Word('Surfing', 20),
            new Word('Climbing', 50),
            new Word('Kiting', 30),
            new Word('Sailing', 20),
            new Word('Snowboarding', 30)
        };
    }

    public class Word {
        @AuraEnabled
        public String text { get; set; }
        @AuraEnabled
        public Integer size { get; set; }

        Word(String text, Integer size) {
            this.text = text;
            this.size = size;
        }
    }
}
