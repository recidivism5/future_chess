var moveSound = new Audio("sounds/move.mp3");
var captureSound = new Audio("sounds/capture.mp3");
var checkSound = new Audio("sounds/check.mp3");

const
    WHITE = 0,
    BLACK = 1,
    EMPTY = 0,
    PAWN = 1,
    ROOK = 2,
    KNIGHT = 3,
    BISHOP = 4,
    QUEEN = 5,
    KING = 6;

class Cell {
    constructor(type, color){
        this.type = type;
        this.color = color;
    }
    copy(cell){
        this.type = cell.type;
        this.color = cell.color;
    }
};

class Move {
    constructor(src, dst){
        this.src = src.slice();
        this.dst = dst.slice();
    }
    copy(move){
        this.src = move.src.slice();
        this.dst = move.dst.slice();
    }
};

class Board {
    constructor(){
        this.toMove = WHITE;
        this.lastMove = new Move([0,0],[0,0]);
        this.whiteKingMoved = false;
        this.blackKingMoved = false;
        this.whiteRookMovedLow = false;
        this.whiteRookMovedHigh = false;
        this.blackRookMovedLow = false;
        this.blackRookMovedHigh = false;
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
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
            ],
            [
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
            ],
            [
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
            ],
            [
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
                new Cell(EMPTY,WHITE),
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
        this.lastMove.copy(board.lastMove);
        this.whiteKingMoved = board.whiteKingMoved;
        this.blackKingMoved = board.blackKingMoved;
        this.whiteRookMovedLow = board.whiteRookMovedLow;
        this.whiteRookMovedHigh = board.whiteRookMovedHigh;
        this.blackRookMovedLow = board.blackRookMovedLow;
        this.blackRookMovedHigh = board.blackRookMovedHigh;
        for (var y = 0; y < 8; y++){
            for (var x = 0; x < 8; x++){
                this.cells[y][x].copy(board.cells[y][x]);
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
            !srcCell.type || 
            (srcCell.color != this.toMove) ||
            (dstCell.type && (srcCell.color == dstCell.color))
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
                        (dst[0] == src[0] && dstCell.type)
                    ){
                        return 0;
                    }
                    console.log("joj");
                    if (dst[0] != src[0]){
                        if (!dstCell.type){
                            var c = this.cells[4][dst[0]];
                            if (
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
                        (dst[0] == src[0] && dstCell.type)
                    ){
                        return 0;
                    }
                    if (dst[0] != src[0]){
                        if (!dstCell.type){
                            var c = this.cells[3][dst[0]];
                            if (
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
                        if (this.cells[src[1]][i].type){
                            return 0;
                        }
                    }
                } else {
                    var d = dst[1] > src[1] ? 1 : -1;
                    for (var i = src[1]+d; i != dst[1]; i += d){
                        if (this.cells[i][src[0]].type){
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
                    if (this.cells[y][x].type){
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
                    if (this.cells[y][x].type){
                        return 0;
                    }
                    x += dx;
                    y += dy;
                }
                break;
            }
            case KING:{
                /*if (this.toMove == WHITE){
                    if (dst[1] == 0){
                        if (!this.kingHasMoved[WHITE]){
                            if (dst[0] == 2 && !this.rookHasMoved[WHITE][0]){

                            } else if (dst[0] == 6 && !this.rookHasMoved[WHITE][1]){

                            } else if (Math.abs(dst[0]-src[0]) > 1 || Math.abs(dst[1]-src[1]) > 1){
                                return 0;
                            }
                        }
                    }
                } else {
                    if (dst[1] == 7){
                        if (!this.kingHasMoved[BLACK]){
                            if (dst[0] == 2 && !this.rookHasMoved[BLACK][0]){

                            } else if (dst[0] == 6 && !this.rookHasMoved[BLACK][1]){

                            } else if (Math.abs(dst[0]-src[0]) > 1 || Math.abs(dst[1]-src[1]) > 1){
                                return 0;
                            }
                        }
                    }
                }*/
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
                    if (this.cells[y][x].type){
                        return 0;
                    }
                    x += dx;
                    y += dy;
                }
            }
        }
        if (dstCell.type){
            return 2;
        }
        return 1;
    }
    doMove(src, dst, r){
        var capture = this.cells[dst[1]][dst[0]].type ? true : false;
        if (r == 3 || r == 4){
            this.cells[r][dst[0]].type = EMPTY; //en passant
            capture = true;
        }
        this.cells[dst[1]][dst[0]].copy(this.cells[src[1]][src[0]]);
        this.cells[src[1]][src[0]].type = EMPTY;
        this.lastMove = new Move(src,dst);
        return capture;
    }
    swapTurn(){
        this.toMove = this.toMove == WHITE ? BLACK : WHITE;
    }
    moveLegalChecked(src, dst){
        var r = this.moveLegal(src, dst);
        if (r != 0){
            var newBoard = new Board();
            newBoard.copy(this);
            newBoard.doMove(src,dst,r);
            newBoard.swapTurn();
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
        console.log(src,dst);
        var r = this.moveLegalChecked(src, dst);
        if (r != 0){
            var capture = this.doMove(src, dst);
            var check = false;
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
            this.swapTurn();
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