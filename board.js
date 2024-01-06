var moveSound = new Audio("sounds/move.mp3");
var captureSound = new Audio("sounds/capture.mp3");
var checkSound = new Audio("sounds/check.mp3");


const 
    WHITE = 0,
    BLACK = 1,
    PAWN = 2,
    ROOK = 3,
    KNIGHT = 4,
    BISHOP = 5,
    QUEEN = 6,
    KING = 7;

class Cell {
    constructor(type, color){
        this.type = type;
        this.color = color;
    }
};

class Board {
    constructor(){
        this.toMove = WHITE;
        this.kingHasMoved = [false,false];//white, black
        this.rookHasMoved = [[false,false],[false,false]];//white, black, low to high
        this.lastMove = [[0,0],[0,0]];
        this.cells = [
            [
                new Cell(ROOK,  WHITE),
                new Cell(KNIGHT,WHITE),
                new Cell(BISHOP,WHITE),
                new Cell(QUEEN, WHITE),
                new Cell(KING,  WHITE),
                new Cell(BISHOP,WHITE),
                new Cell(KNIGHT,WHITE),
                new Cell(ROOK,  WHITE),
            ],
            [
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
                new Cell(PAWN,WHITE),
            ],
            [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
            ],
            [
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
                new Cell(PAWN,BLACK),
            ],
            [
                new Cell(ROOK,  BLACK),
                new Cell(KNIGHT,BLACK),
                new Cell(BISHOP,BLACK),
                new Cell(QUEEN, BLACK),
                new Cell(KING,  BLACK),
                new Cell(BISHOP,BLACK),
                new Cell(KNIGHT,BLACK),
                new Cell(ROOK,  BLACK),
            ],
        ];
    }
    copy(board){
        this.toMove = board.toMove;
        this.kingHasMoved = board.kingHasMoved.slice();//white, black
        this.rookHasMoved = [board.rookHasMoved[0].slice(),board.rookHasMoved[1].slice()];//white, black, low to high
        this.lastMove = [board.lastMove[0].slice(),board.lastMove[1].slice()]; //js experts: tell me if there's a better way to do this, I don't trust slice to copy internal array data
        for (var y = 0; y < 8; y++){
            for (var x = 0; x < 8; x++){
                var c = board.cells[y][x];
                this.cells[y][x] = c ? new Cell(c.type,c.color) : null;
            }
        }
    }
    moveLegal(src, dst){
        if (src[0] == dst[0] && src[1] == dst[1]){
            return 0;
        }
        var srcCell = this.cells[src[1]][src[0]];
        var dstCell = this.cells[dst[1]][dst[0]];
        if (
            !srcCell || 
            (srcCell.color != this.toMove) ||
            (dstCell && (srcCell.color == dstCell.color))
        ){
            return 0;
        }
        switch (srcCell.type){
            case PAWN: {
                if (srcCell.color == WHITE){
                    if (
                        dst[1] <= src[1] ||
                        Math.abs(dst[0]-src[0]) > 1 ||
                        (src[1] == 1 && dst[1]-src[1] > 2) ||
                        (src[1] != 1 && dst[1]-src[1] > 1) ||
                        (dst[0] == src[0] && dstCell)
                    ){
                        return 0;
                    }
                    if (dst[0] != src[0]){
                        if (!dstCell){
                            var c = this.cells[4][dst[0]];
                            if (
                                c && 
                                c.type == PAWN && 
                                this.lastMove[0][0] == dst[0] && 
                                this.lastMove[0][1] == 6 && 
                                this.lastMove[1][0] == dst[0] && 
                                this.lastMove[1][1] == 4
                            ){
                                return 4;
                            } else {
                                return 0;
                            }
                        }
                    }
                } else {
                    if (
                        dst[1] >= src[1] ||
                        Math.abs(src[0]-dst[0]) > 1 ||
                        (src[1] == 6 && src[1]-dst[1] > 2) ||
                        (src[1] != 6 && src[1]-dst[1] > 1) ||
                        (dst[0] == src[0] && dstCell)
                    ){
                        return 0;
                    }
                    if (dst[0] != src[0]){
                        if (!dstCell){
                            var c = this.cells[3][dst[0]];
                            if (
                                c &&
                                c.type == PAWN &&
                                this.lastMove[0][0] == dst[0] &&
                                this.lastMove[0][1] == 1 &&
                                this.lastMove[1][0] == dst[0] &&
                                this.lastMove[1][1] == 3
                            ){
                                return 3;
                            } else {
                                return 0;
                            }
                        }
                    }
                }
                break;
            }
            case ROOK:{
                if (dst[0] != src[0]){
                    var d = dst[0] > src[0] ? 1 : -1;
                    for (var i = src[0]+d; i != dst[0]; i += d){
                        if (this.cells[src[1]][i]){
                            return 0;
                        }
                    }
                } else {
                    var d = dst[1] > src[1] ? 1 : -1;
                    for (var i = src[1]+d; i != dst[1]; i += d){
                        if (this.cells[i][src[0]]){
                            return 0;
                        }
                    }
                }
                break;
            }
            case KNIGHT:{
                if (
                    (Math.abs(dst[0]-src[0]) == 1 && Math.abs(dst[1]-src[1]) == 2) ||
                    (Math.abs(dst[0]-src[0]) == 2 && Math.abs(dst[1]-src[1]) == 1)
                ){

                } else {
                    return 0;
                }
                break;
            }
            case BISHOP:{
                if (Math.abs(dst[0]-src[0]) != Math.abs(dst[1]-src[1])){
                    return 0;
                }
                var dx = dst[0] == src[0] ? 0 : dst[0] > src[0] ? 1 : -1;
                var dy = dst[1] == src[1] ? 0 : dst[1] > src[1] ? 1 : -1;
                var x = src[0]+dx;
                var y = src[1]+dy;
                while (x != dst[0] || y != dst[1]){
                    if (this.cells[y][x]){
                        return 0;
                    }
                    x += dx;
                    y += dy;
                }
                break;
            }
            case QUEEN:{
                var dx = dst[0] == src[0] ? 0 : dst[0] > src[0] ? 1 : -1;
                var dy = dst[1] == src[1] ? 0 : dst[1] > src[1] ? 1 : -1;
                if (dx && dy){
                    if (Math.abs(dst[0]-src[0]) != Math.abs(dst[1]-src[1])){
                        return 0;
                    }
                }
                var x = src[0]+dx;
                var y = src[1]+dy;
                while (x != dst[0] || y != dst[1]){
                    if (this.cells[y][x]){
                        return 0;
                    }
                    x += dx;
                    y += dy;
                }
                break;
            }
            case KING:{
                if (Math.abs(dst[0]-src[0]) > 1 || Math.abs(dst[1]-src[1]) > 1){
                    return 0;
                }
                var dx = dst[0] == src[0] ? 0 : dst[0] > src[0] ? 1 : -1;
                var dy = dst[1] == src[1] ? 0 : dst[1] > src[1] ? 1 : -1;
                if (dx && dy){
                    if (Math.abs(dst[0]-src[0]) != Math.abs(dst[1]-src[1])){
                        return 0;
                    }
                }
                var x = src[0]+dx;
                var y = src[1]+dy;
                while (x != dst[0] || y != dst[1]){
                    if (this.cells[y][x]){
                        return 0;
                    }
                    x += dx;
                    y += dy;
                }
            }
        }
        if (dstCell){
            return 2;
        }
        return 1;
    }
    doMove(src, dst, r){
        if (r == 3 || r == 4){
            this.cells[r][dst[0]] = null; //en passant
        }
        var srcCell = this.cells[src[1]][src[0]];
        this.cells[dst[1]][dst[0]] = new Cell(srcCell.type, srcCell.color);
        this.cells[src[1]][src[0]] = null;
        this.lastMove = [[src[0],src[1]],[dst[0],dst[1]]];
        this.toMove = this.toMove == WHITE ? BLACK : WHITE;
    }
    moveLegalChecked(src, dst){
        var r = this.moveLegal(src, dst);
        if (r != 0){
            var newBoard = new Board();
            newBoard.copy(this);
            newBoard.doMove(src,dst,r);
            var kx, ky;
            for (var y = 0; y < 8; y++){
                for (var x = 0; x < 8; x++){
                    var k = newBoard.cells[y][x];
                    if (k && k.color != newBoard.toMove && k.type == KING){
                        ky = y;
                        kx = x;
                        y = 8;
                        x = 8;
                    }
                }
            }
            for (var y = 0; y < 8; y++){
                for (var x = 0; x < 8; x++){
                    var c = newBoard.cells[y][x];
                    if (c && c.color == newBoard.toMove){
                        if (newBoard.moveLegal([x,y],[kx,ky])){
                            return 0;
                        }
                    }
                }
            }
        }
        return r;
    }
    attemptMove(src, dst){
        var r = this.moveLegalChecked(src, dst);
        if (r != 0){
            var capture = false;
            var check = false;
            if (r == 3 || r == 4){
                this.cells[r][dst[0]] = null; //en passant
                capture = true;
            }
            var srcCell = this.cells[src[1]][src[0]];
            this.cells[dst[1]][dst[0]] = new Cell(srcCell.type, srcCell.color);
            this.cells[src[1]][src[0]] = null;
            this.lastMove = [[src[0],src[1]],[dst[0],dst[1]]];

            //check for check:
            var kx, ky;
            for (var y = 0; y < 8; y++){
                for (var x = 0; x < 8; x++){
                    var k = this.cells[y][x];
                    if (k && k.color != this.toMove && k.type == KING){
                        ky = y;
                        kx = x;
                        y = 8;
                        x = 8;
                    }
                }
            }
            for (var y = 0; y < 8; y++){
                for (var x = 0; x < 8; x++){
                    var c = this.cells[y][x];
                    if (c && c.color == this.toMove){
                        if (this.moveLegal([x,y],[kx,ky])){
                            r = -1;
                            y = 8;
                            x = 8;
                            check = true;
                        }
                    }
                }
            }
            this.toMove = this.toMove == WHITE ? BLACK : WHITE;
            moveSound.play();
            if (capture){
                captureSound.play();
            }
            if (check){
                checkSound.play();
            }
        }
        return r;
    }
};