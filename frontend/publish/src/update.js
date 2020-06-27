/*
 * class to communicate with server
 */
'use strict';
import layout from './layout.js';
import remote from './remote.js';

const createTableRow = (stack) => {
    return $('<tr>')
        .append($('<th>', { "scope": "row" }).text(stack.id))
        .append($('<td>').text(stack.title))
        .append($('<td>').text(remote.getMyData().username))
        .append($('<td>').text(stack.created_at))
        .append($('<td>').text(stack.updated_at))
        .append($('<td>')
            .append($('<button>', { "class": "btn btn-warning" }).text("Stage"))
        );
}

let tmpMyStacks = null;

class Update {
    constructor() {

    }
    render() {
        const login = remote.loggedIn();
        if (!login) {
            $(layout.ids.container)
            .empty()
            .append('<br>')
            .append($('<div>', { "class": "alert alert-danger", "role": "alert" })
                .append($('<h1>').text("You must Login first!"))
            );
            return;
        }
        // cleanup
        $(layout.ids.develTable).empty();
        $(layout.ids.stageDeck).empty();
        $(layout.ids.publishDeck).empty();
        $(layout.classes.helpDoc).hide();
        // update
        const updateStack = (results) => {
            tmpMyStacks = results;
            results.forEach(stack => {
                // only list developing stacks in table
                let count = 0;
                if (stack.status === "develop") {
                    $(layout.ids.develTable).append(createTableRow(stack));
                    count++;
                }
                if (count) {
                    $(layout.classes.helpDoc + "_develop").show();
                }
            });
        };
        remote.getMyStacks(updateStack);
    }
}

export default new Update();
