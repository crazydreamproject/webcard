/*
 * class to communicate with server
 * We will use 1:1 relationship for stk:package.
 */
'use strict';
import layout from './layout.js';
import remote from './remote.js';
import modal from './modal.js';

const createTableRow = (idx, stk, pkg) => {
    return $('<tr>', { "id": stk.id + stk.title })
    .append($('<th>', { "scope": "row" }).text(idx+1))
    .append($('<td>').text(stk.title))
    .append($('<td>').text(remote.getMyData().username))
    .append($('<td>').text(stk.created_at))
    .append($('<td>').text(stk.updated_at))
    .append($('<td>')
        .append($('<button>', { "class": "btn btn-warning" }).text("Stage").click(()=>{
            modal.stage(stk, pkg);
        }))
    );
}

const createCard = (stk, pkg) => {
    return $('<div>', { "class": "col-auto mb-3" })
    .append($('<div>', { "class": "card bg-light", "style": "width: 20rem;" })
        .append($('<img>', { "src": pkg.image, "class": "card-img-top" }))
        //.append($('<hr>'))
        .append($('<div>', { "class": "card-body"})
            .append($('<h5>', { "class": "card-title" }).text(pkg.name))
            .append($('<p>', { "class": "card-text" }).text(pkg.description))
            .append($('<hr>'))
            .append($('<form>', { "class": "form" })
                .append($('<div>', { "class": "form-group" })
                    .append($('<div>', { "class": "input-group mb-3" })
                        .append($('<div>', { "class": "input-group-prepend" })
                            .append($('<span>', { "class": "input-group-text" }).text("Language"))
                        )
                        .append($('<label>', { "class": "sr-only" }).text("Language"))
                        .append($('<input>', { "class": "form-control", "type": "text", "readonly": true, "value": pkg.metadata.lang }))
                    )
                )
                .append($('<div>', { "class": "form-group" })
                    .append($('<div>', { "class": "input-group" })
                        .append($('<div>', { "class": "input-group-prepend" })
                            .append($('<span>', { "class": "input-group-text" }).text("Above Age"))
                        )
                        .append($('<label>', { "class": "sr-only" }).text("Age"))
                        .append($('<input>', { "class": "form-control", "type": "text", "readonly": true, "value": pkg.metadata.age }))
                    )
                )
            )
        )
        .append($('<div>', { "class": "card-footer"})
            .append($('<button>', { "class": "btn btn-primary mr-2" }).text("Develop").click(()=>{
                modal.develop(stk, pkg);
            }))
            .append($('<button>', { "class": "ml-1 btn btn-warning mr-2" }).text("Update").click(()=>{
                modal.stage(stk, pkg);
            }))
            .append($('<button>', { "class": "ml-1 btn btn-danger" }).text("Publish").click(()=>{
                modal.publish(stk, pkg);
            }))
            .append($('<hr>'))
            .append($('<p>').text("Updated: " + pkg.updated_at))
        )
    );
}

class Update {
    constructor() {

    }
    render() {
        let login = remote.loggedIn();
        // cleanup
        $(layout.ids.develTable).empty();
        $(layout.ids.stageDeck).empty();
        $(layout.ids.publishDeck).empty();
        $(layout.classes.helpDoc).hide();
        // alert login
        if (!login) {
            $(layout.ids.container)
            .before($('<div>', { "class": "alert alert-danger", "role": "alert" })
                .append($('<h1>').text("You must Sign-In first!"))
            );
            $(".table").hide();
            // call me again after server communication, if any.
            remote.lazyCall(this.render);
            return;
        }
        // undo alert login
        $(".table").show();
        $(".alert-danger").remove();
        // update with server info
        const updateDevel = (stacks, packages) => {
            let count = 0;
            stacks.forEach(stk => {
                // only list developing stacks in table
                if (stk.status === "develop") {
                    let pkg = null;
                    packages.forEach(p => {
                        if (p.stack === stk.id) {
                            if (pkg != null) {
                                console.error("1:1 relationship of stack:package is broken! Its now 1:N");
                            }
                            pkg = p;
                        }
                    });
                    $(layout.ids.develTable).append(createTableRow(count, stk, pkg));
                    count++;
                }
            });
            if (count) {
                $(layout.classes.helpDoc + "_develop").show();
            }
        };
        const updateStaging = (stacks, packages) => {
            let divtop = $('<div>', { "class": "row" });
            let count = 0;
            stacks.forEach(stk => {
                // only list staging stacks to cards
                if (stk.status === "staging") {
                    packages.forEach(pkg => {
                        if (pkg.stack === stk.id) {
                            divtop.append(createCard(stk, pkg));
                            count++;
                        }
                    });
                }
            });
            if (count) {
                $(layout.ids.stageDeck).append(divtop);
                    $(layout.classes.helpDoc + "_stage").show();
            }
        }
        // we need both stacks and packages list, so cascade the call
        remote.getMyStacks((stacks)=>{
            remote.getMyPackages((packages)=>{
                updateDevel(stacks, packages);
                updateStaging(stacks, packages);
            });
        });
    }
}

export default new Update();
