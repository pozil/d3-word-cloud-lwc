import { LightningElement, wire } from 'lwc';
import getWords from '@salesforce/apex/WordCloudController.getWords';

export default class WordCloudContainer extends LightningElement {
    width = 400;
    height = 400;
    words;

    @wire(getWords)
    getWords({ error, data }) {
        if (data) {
            this.words = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.words = undefined;
        }
    }
}
