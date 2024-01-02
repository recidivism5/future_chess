class Cell {
    constructor(type, color){
        this.type = type;
        this.color = color;
    }
};

class Board {
    constructor(){
        this.cells = [
            [
                new Cell("rook",  "white"),
                new Cell("knight","white"),
                new Cell("bishop","white"),
                new Cell("queen", "white"),
                new Cell("king",  "white"),
                new Cell("bishop","white"),
                new Cell("knight","white"),
                new Cell("rook",  "white"),
            ],
            [
                new Cell("pawn","white"),
                new Cell("pawn","white"),
                new Cell("pawn","white"),
                new Cell("pawn","white"),
                new Cell("pawn","white"),
                new Cell("pawn","white"),
                new Cell("pawn","white"),
                new Cell("pawn","white"),
            ],
            [
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
            ],
            [
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
            ],
            [
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
            ],
            [
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
                new Cell("empty",""),
            ],
            [
                new Cell("pawn","black"),
                new Cell("pawn","black"),
                new Cell("pawn","black"),
                new Cell("pawn","black"),
                new Cell("pawn","black"),
                new Cell("pawn","black"),
                new Cell("pawn","black"),
                new Cell("pawn","black"),
            ],
            [
                new Cell("rook",  "black"),
                new Cell("knight","black"),
                new Cell("bishop","black"),
                new Cell("queen", "black"),
                new Cell("king",  "black"),
                new Cell("bishop","black"),
                new Cell("knight","black"),
                new Cell("rook",  "black"),
            ],
        ];
    }
};