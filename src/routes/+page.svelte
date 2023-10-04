<script>
// dev mode
import { Game, move, status, moves, aiMove, getFen } from 'js-chess-engine'
const game = new Game()

// build mode
// import jsChessEngine from 'js-chess-engine'
// const game = new jsChessEngine.Game()

const cols = "ABCDEFGH"
const rows = "87654321"
var gl = false
var table = ["♜♞♝♛♚♝♞♜", "♟♟♟♟♟♟♟♟♟", "        ", "        ",
"        ", "        ", "♟♟♟♟♟♟♟♟♟", "♜♞♝♛♚♝♞♜"].map(v => v.split(""))
var tc = ['bbbbbbbb','bbbbbbbb','nnnnnnnn','nnnnnnnn',
'nnnnnnnn','nnnnnnnn','wwwwwwww','wwwwwwww'].map(v => v.split(""))
var pm = []
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
    if (mit[0]=='♚' && i == 7 && j == 6) {
        table[7][7] = " "
        tc[7][7] = "n"
        table[7][5] = "♜"
        tc[7][5] = "w"
    }
    if (mit[0]=='♚' && i == 7 && j == 2) {
        table[7][0] = " "
        tc[7][0] = "n"
        table[7][3] = "♜"
        tc[7][3] = "w"
    }

    game.move(from[0], col + row)
    setTimeout(()=> {
        gl = true
        var vl = Object.entries(game.aiMove(3))[0]
        var xf = cols.indexOf(vl[0][0])
        var yf = rows.indexOf(vl[0][1])
        var xt = cols.indexOf(vl[1][0])
        var yt = rows.indexOf(vl[1][1])
        var vmit = [table[yf][xf], tc[yf][xf]]
        var vut = [table[yt][xt], tc[yt][xt]]
        table[yf][xf] = " "
        tc[yf][xf] = "n"
        table[yt][xt] = vmit[0]
        tc[yt][xt] = vmit[1]
        gl = false
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
                    class={tc[i][j]} 
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
<style>
h1, td {
    text-align: center;
}
table {
    user-select: none;
    margin: auto;
    border-spacing: 0px;
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
td.s {
    height: 20px;
    background-color: lightgray;
}
td.o {
    width: 20px;
    background-color: lightgray;
}
td.c {
    background-color: lightgray;
    width: 20px;
    height: 20px;
}
td.x {
    background-color: rgb(190, 229, 187);
}

td.s1.x {
    background-color: rgb(39, 95, 73);
}
</style>