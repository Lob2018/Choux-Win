"use strict";

class AccordeonEl extends Element {
    /**
     * CONSTRUCTEUR DE L'ACCORDEON
     * @param {*Le chamin relatif de l'image de l'accordeon} src
     * @param {*Largeur de l'accordeon} imgW
     * @param {*Hauteur de l'accordeon} imgH
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale de l'accordeon} x
     * @param {*La position verticale de l'accordeon} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            // INITIALISER 
            var img = new Image(imgW, imgH);
            img.src = src;

            super("accordeon", plateau, x, y, imgW, imgH, x, y, 0);
            this.img = img;
            this.w = imgW;
            this.h = imgH;
        }
        /**
         * RÉCUPÉRER L'IMAGE
         */
    getImage() {
        return this.img;
    }
}