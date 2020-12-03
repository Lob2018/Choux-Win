"use strict";

class MaireEl extends Element {
    /**
     * CONSTRUCTEUR DU MAIRE
     * @param {*Le chamin relatif de l'image du maire} src
     * @param {*Largeur du maire} imgW
     * @param {*Hauteur du maire} imgH     
     * @param {*Le plateau pour le positionner} plateau 
     * @param {*La position horizontale du maire} x
     * @param {*La position verticale du maire} y
     */
    constructor(src, imgW, imgH, plateau, x, y) {
            var img = new Image(imgW, imgH);
            img.src = src;

            super("maire", plateau, x, y, imgW, imgH);
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