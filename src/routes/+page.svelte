<script>
// dev mode
// import { Game, move, status, moves, aiMove, getFen } from 'js-chess-engine'
// const game = new Game()
// build mode
import jsChessEngine from 'js-chess-engine'
const game = new jsChessEngine.Game()
var cf = new Map([
        ['p', '♟'],['r', '♜'],['n', '♞'],['b', '♝'],['q', '♛'],['k', '♚'], [null, ' ']
    ])
const getf = (p) => {
    if (!p) return " "
    return cf.get(p.toLowerCase())
}
var chjson = game.exportJson()
const aidepth = 3
const cols = "ABCDEFGH"
const rows = "87654321"
var gl = false, vl = ['', '']
var pm = []
var from = ['', 0, 0]
const f = (i, j, row, col) => {
    from = [col+row, i, j]
    pm = game.moves(from[0])
}
const drop = (row, col) => {
    game.move(from[0], col + row)
    chjson = game.exportJson()
    gl = true
    setTimeout(()=> {
        if (!chjson.isFinished) {
            vl = Object.entries(game.aiMove(aidepth))[0]
        }
        chjson = game.exportJson()
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
                on:drop={() => drop(row, col)}
                >
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span 
                    on:dragstart={() => f(i, j, row, col)}
                    on:dragend={() => pm = []}
                    class="{chjson.pieces[col+row]} {!gl && vl[1] == col+row ? 'u' : ''}" 
                    draggable={!gl}>{getf(chjson.pieces[col+row])}</span>
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
td span.r, td span.n, td span.b, td span.q, td span.k, td span.p {
    color: black;
    text-shadow: 1px 1px 7px white;
}
td span.R, td span.N, td span.B, td span.Q, td span.K, td span.P {
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