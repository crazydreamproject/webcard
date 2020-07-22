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

const createCard = (stk, pkg, status) => {
    let card = $('<div>', { "class": "col-lg-3 col-md-6 mb-4" })
    .append($('<div>', { "class": "card bg-light" })
        .append($('<a>', { "href": "#" }).click(()=>{ modal.detail(stk, pkg); })
            .append($('<div>', { "class": "view overlay" })
                .append($('<img>', { "src": pkg.image, "style": "width: 100%;" }))
            )
            .append($('<div>', { "class": "card-body text-center" })
                .append($('<h5>')
                    .append($('<strong>')
                        .append($('<p>', { "class": "dark-grey-text" }).text(pkg.name))
                    )
                )
            )
        )
    );
    if (status == "staging") {
        card.find(".card")
        .append($('<div>', { "class": "card-footer"})
            .append($('<button>', { "class": "btn btn-primary col-10 mb-2" }).text("Develop").click(()=>{
                modal.develop(stk, pkg);
            }))
            .append($('<button>', { "class": "btn btn-warning col-10 mb-2" }).text("Modify").click(()=>{
                modal.stage(stk, pkg);
            }))
            .append($('<button>', { "class": "btn btn-danger col-10" }).text("Publish").click(()=>{
                modal.publish(stk, pkg);
            }))
            .append($('<hr>'))
            .append($('<p>').text("Updated: " + pkg.updated_at))
        );
    } else if (status == "publish") {
        card.find(".card")
        .append($('<div>', { "class": "card-footer"})
            .append($('<button>', { "class": "btn btn-warning col-10" }).text("Stage").click(()=>{
                modal.publish(stk, pkg);
            }))
            .append($('<hr>'))
            .append($('<p>').text("Updated: " + pkg.updated_at))
        );
    } 
    return card;
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
            let divtop = $('<div>');
            let divrow = null;
            let count = 0;
            stacks.forEach(stk => {
                // a row to contain 4 cards
                if (count % 4 == 0) {
                    divrow = $('<div>', { "class": "row wow fadeIn" });
                    divtop.append(divrow);
                }
                // only list staging stacks to cards
                if (stk.status === "staging") {
                    packages.forEach(pkg => {
                        if (pkg.stack === stk.id) {
                            divrow.append(createCard(stk, pkg, "staging"));
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
        const updatePublished = (stacks, packages) => {
            let divtop = $('<div>');
            let divrow = null;
            let count = 0;
            stacks.forEach(stk => {
                // a row to contain 4 cards
                if (count % 4 == 0) {
                    divrow = $('<div>', { "class": "row wow fadeIn" });
                    divtop.append(divrow);
                }
                // only list published stacks to cards
                if (stk.status === "publish") {
                    packages.forEach(pkg => {
                        if (pkg.stack === stk.id) {
                            divrow.append(createCard(stk, pkg, "publish"));
                            count++;
                        }
                    });
                }
            });
            if (count) {
                $(layout.ids.publishDeck).append(divtop);
                    $(layout.classes.helpDoc + "_publish").show();
            }
        }
        // we need both stacks and packages list, so cascade the call
        remote.getMyStacks((stacks)=>{
            remote.getMyPackages((packages)=>{
                updateDevel(stacks, packages);
                updateStaging(stacks, packages);
                updatePublished(stacks, packages);
            });
        });
    }
}

export default new Update();
