import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import D3 from '@salesforce/resourceUrl/d3';

const HEX_CHARS = '0123456789ABCDEF';

export default class WordCloud extends LightningElement {
    @api
    svgWidth = 400;
    @api
    svgHeight = 400;

    @api
    set words(value) {
        // Clone data to prevent read-only proxy error
        this._words = JSON.parse(JSON.stringify(value));
        // Refresh d3 viz if initialized
        if (this.d3Initialized) {
            this.initializeViz();
        }
    }
    get words() {
        return this._words;
    }

    d3Initialized = false;

    renderedCallback() {
        if (this.d3Initialized) {
            return;
        }
        this.d3Initialized = true;

        Promise.all([
            loadScript(this, D3 + '/d3.min.js'),
            loadScript(this, D3 + '/d3.layout.cloud.js')
        ])
            .then(() => {
                this.initializeViz();
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading D3',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    initializeViz() {
        const width = this.svgWidth;
        const height = this.svgHeight;

        // Init SVG
        // eslint-disable-next-line no-undef
        const svg = d3
            .select(this.template.querySelector('svg.d3'))
            .append('g')
            .attr('transform', 'translate(10, 10)');

        // Prep cloud layout
        // eslint-disable-next-line no-undef
        const layout = d3.layout
            .cloud()
            .size([width, height])
            .words(this._words)
            .padding(5) //space between words
            .rotate(() => ~~(Math.random() * 2) * 90)
            .fontSize((d) => d.size) // font size of words
            .on('end', draw);
        layout.start();

        // Random color generator
        const getRandomColor = () => {
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += HEX_CHARS[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        // Draw words in cloud
        function draw(words) {
            svg.append('g')
                .attr(
                    'transform',
                    'translate(' +
                        layout.size()[0] / 2 +
                        ',' +
                        layout.size()[1] / 2 +
                        ')'
                )
                .selectAll('text')
                .data(words)
                .enter()
                .append('text')
                .style('font-size', (d) => d.size)
                .style('fill', () => getRandomColor())
                .attr('text-anchor', 'middle')
                .style('font-family', 'Impact')
                .attr(
                    'transform',
                    (d) =>
                        'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
                )
                .text((d) => d.text);
        }
    }
}
