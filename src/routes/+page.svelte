<script>
// dev mode
// import { Game, move, status, moves, aiMove, getFen } from 'js-chess-engine'
// const game = new Game()

// build mode
import jsChessEngine from 'js-chess-engine'
const game = new jsChessEngine.Game()

const cols = "ABCDEFGH"
const rows = "87654321"
var gl = false, vl = ['', '']
var table = "♜♞♝♛♚♝♞♜|♟♟♟♟♟♟♟♟♟|        |        |        |        |♟♟♟♟♟♟♟♟♟|♜♞♝♛♚♝♞♜"
    .split("|").map(v => v.split(""))
var tc = 'bbbbbbbb|bbbbbbbb|nnnnnnnn|nnnnnnnn|nnnnnnnn|nnnnnnnn|wwwwwwww|wwwwwwww'
    .split("|").map(v => v.split(""))
var pm = [], chjson = {halfMove: 1, castling: {}}
var from = ['', 0, 0]
const f = (i, j, row, col) => {
    from = [col+row, i, j]
    pm = game.moves(from[0])
}
const drop = (i, j, row, col) => {
    var mit = [table[from[1]][from[2]], tc[from[1]][from[2]]]
    var ut = [table[i][j], tc[i][j]]
    table[from[1]][from[2]] = " "
    tc[from[1]][from[2]] = "n"
    table[i][j] = mit[0]
    tc[i][j] = mit[1]
    if (mit[0]=='♚' && (i == 7 || i == 0)) {
        if (chjson.castling.whiteShort && j == 6) 
            table[i][7] = " ", tc[i][7] = "n", table[i][5] = "♜", tc[i][5] = "w"
        if (chjson.castling.whiteLong && j == 2)
            table[i][0] = " ", tc[i][0] = "n", table[i][3] = "♜", tc[i][3] = "w"
    }
    game.move(from[0], col + row)
    gl = true
    setTimeout(()=> {
        var lc = chjson.castling.blackShort, rc = chjson.castling.blackLong
        if (!game.exportJson().isFinished) {
            vl = Object.entries(game.aiMove(3))[0]
            var xf = cols.indexOf(vl[0][0])
            var yf = rows.indexOf(vl[0][1])
            var xt = cols.indexOf(vl[1][0])
            var yt = rows.indexOf(vl[1][1])
            var vmit = [table[yf][xf], tc[yf][xf]]
            var vut = [table[yt][xt], tc[yt][xt]]
            if (vmit[0]=='♚' && (yt == 7 || yt == 0)) {
                if (lc && xt == 6)
                    table[yt][7] = " ", tc[yt][7] = "n", table[yt][5] = "♜", tc[yt][5] = "b"
                if (rc && xt == 2)
                    table[yt][0] = " ", tc[yt][0] = "n", table[yt][3] = "♜", tc[yt][3] = "b"
            }
            table[yf][xf] = " "
            tc[yf][xf] = "n"
            table[yt][xt] = vmit[0]
            tc[yt][xt] = vmit[1]
            gl = false
        }
        chjson = game.exportJson()
    }, 500)
}
</script>
<h1>Sakk</h1>
<table>
    <tr>
        <td class="c"></td>
    {#each cols as col}
        <td class="s">{col}</td>   
    {/each}
        <td class="c"></td>
    </tr>
    {#each rows as row, i}
    <tr>
        <td class="o">{8-i}</td>
        {#each cols as col, j}
            <td class="s{(i + j) % 2} {!gl && pm.includes(col+row) ? 'x': ''}"
                on:dragover={e => !gl && pm.includes(col+row) ? (e.preventDefault(), true): false}
                on:drop={() => drop(i, j, row, col)}
                >
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span 
                    on:dragstart={() => f(i, j, row, col)}
                    on:dragend={() => pm = []}
                    class="{tc[i][j]} {!gl && vl[1] == col+row ? 'u' : ''}" 
                    draggable={!gl && tc[i][j] == 'w'}>{table[i][j]}</span>
            </td>
        {/each}
        <td class="o">{8-i}</td>
    </tr>
    {/each}
    <tr>
        <td class="c"></td>
    {#each cols as col}
        <td class="s">{col}</td>   
    {/each}
        <td class="c"></td>
    </tr>
</table>
{#if chjson.checkMate}<h2>Matt</h2>
{:else if chjson.isFinished}<h2>Döntetlen</h2>
{:else if chjson.check}<h2>Sakk</h2>
{:else if !gl}<h2>Te lépsz!</h2>
{:else}<h2>&nbsp;</h2>
{/if}
<style>
h1, td, h2 {
    text-align: center;
}
table {
    user-select: none;
    margin: auto;
    border-spacing: 0px;
    box-shadow: 1px 1px 4px black;
}
td {
    width: 50px;
    height: 50px;
    background-color: rgb(198, 198, 198);
}
td.s1 {
    background-color: rgb(65, 65, 65);
}
td span {
    font-size: 40px;
    display: inline-block;
}
td span.b {
    color: black;
    text-shadow: 1px 1px 7px white;
}
td span.w {
    color: white;
    text-shadow: 1px 1px 7px black;
    cursor: grab;
    background: transparent;
    transform: translateY(-3px);
}
td span.u {
    color: rgb(112, 31, 1);
    text-shadow: 1px 1px 7px white;
}
td.s {
    height: 20px;
    background-color: rgb(233, 233, 233);
}
td.o {
    width: 20px;
    background-color: rgb(233, 233, 233);
}
td.c {
    background-color: rgb(233, 233, 233);
    width: 20px;
    height: 20px;
}
td.x {
    background-color: rgb(190, 229, 187);
}
td.s1.x {
    background-color: rgb(39, 95, 73);
}
h2 {
    color: rgb(219, 88, 88);
}
</style>