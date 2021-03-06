/*
 * layout.js: Set components to body
 */

const containerId = "MainFrameId";
const develTableId = "TbodyDevelopId";
const stageDeckId = "StagingCardDeckId";
const publishDeckId = "PublishedCardDeckId";
const modalId = "ModalTopId";
const modalFormId = "ModalFormId";
const helpDocCls = "help_document";

let setupElements = () => {
    // modal to manipulate staging/publishing
    $('body')
    .append($('<div>', { "class": "modal fade", "tabindex": "-1", "role": "dialog", "id": modalId })
        .append($('<div>', { "class": "modal-dialog modal-lg", "role": "document" })
            .append($('<div>', { "class": "modal-content" })
                .append($('<div>', { "class": "modal-header" })
                    .append($('<h5>', { "class": "modal-title" }).text("Modal title"))
                    .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "modal", "aria-label": "Close" })
                        .append($('<span>', { "aria-hidden": "true" }).html("&times;"))
                    )
                )
                .append($('<div>', { "class": "modal-body" })
                    .append($('<div>', { "class": "container-fluid" })
                        .append($('<form>', { "id": modalFormId })
                            .append($('<div>', { "class": "form-group row"}) // this is just a sample. will be overwritten.
                                .append($('<label>', { "class": "col-3 col-form-label", "for": "inputName"}).text("Name"))
                                .append($('<input>', { "class": "col-9 form-control", "id": "inputName"}).text("your name here"))
                            )
                        )
                    )
                )
                .append($('<div>', { "class": "modal-footer" })
                    .append($('<button>', { "class": "btn btn-secondary", "type": "button", "data-dismiss": "modal" }).text("Cancel"))
                    .append($('<button>', { "class": "btn btn-primary", "type": "submit", "form": modalFormId }).text("Submit"))
                )
            )
        )
    );
    // main container view
    $('body')
    .append($('<div>', { "class": "container", "id": containerId })
        .append($('<hr>'))
        .append($('<h1>', { "class": "" })
            .append($('<span>', { "class": "badge badge-primary" }).text("　"))
            .append($('<span>').text(" Developing"))
        )
        .append($('<table>', { "class": "table table-hover table-striped" })
            .append($('<thead>', { "class": "thead-light" })
                .append($('<tr>')
                    .append($('<th>', { "scope": "col" }).text("#"))
                    .append($('<th>', { "scope": "col" }).text("Title"))
                    .append($('<th>', { "scope": "col" }).text("Author"))
                    .append($('<th>', { "scope": "col" }).text("Created"))
                    .append($('<th>', { "scope": "col" }).text("Updated"))
                    .append($('<th>', { "scope": "col" }).text("Action"))
                )
            )
            .append($('<tbody>', { "class": "", "id": develTableId }) // below <tr>s are inserted for test, will be removed by update.
                .append($('<tr>')
                    .append($('<th>', { "scope": "row" }).text("1"))
                    .append($('<td>').text("Awesome game"))
                    .append($('<td>').text("by myself"))
                    .append($('<td>').text("yesterday"))
                    .append($('<td>').text("today"))
                    .append($('<td>')
                        .append($('<button>', { "class": "btn btn-warning" }).text("Stage"))
                    )
                )
                .append($('<tr>')
                    .append($('<th>', { "scope": "row" }).text("2"))
                    .append($('<td>').text("Awesome game"))
                    .append($('<td>').text("by myself"))
                    .append($('<td>').text("yesterday"))
                    .append($('<td>').text("today"))
                    .append($('<td>')
                        .append($('<button>', { "class": "btn btn-warning" }).text("Stage"))
                    )
                )
                .append($('<tr>')
                    .append($('<th>', { "scope": "row" }).text("3"))
                    .append($('<td>').text("Awesome game"))
                    .append($('<td>').text("by myself"))
                    .append($('<td>').text("yesterday"))
                    .append($('<td>').text("today"))
                    .append($('<td>')
                        .append($('<button>', { "class": "btn btn-warning" }).text("Stage"))
                    )
                )
            )
        )
        .append($('<br>'))
        .append($('<p>', { "class": helpDocCls + " " + helpDocCls + "_develop" })
            .append($('<span>').text("Press "))
            .append($('<button>', { "class": "btn btn-warning"}).text("Stage"))
            .append($('<span>').text(" button in above table to setup package data and proceed to rehearsal stage testing."))
        )
        .append($('<hr>'))
        .append($('<h1>', { "class": "" })
            .append($('<span>', { "class": "badge badge-warning" }).text("　"))
            .append($('<span>').text(" Staging"))
        )
        //.append($('<div>', { "class": "card-deck", "id": "StagingCardDeck" }) // card-deck will not reflect width css of card...
        // using container-fluid + row + col-auto had demerit of footer not aligning to each cards...
        .append($('<section>', { "class": "text-center mb-4", "id": stageDeckId })
            .append($('<div>', { "class": "row" })
                .append($('<div>', { "class": "col-auto mb-3" })
                    .append($('<div>', { "class": "card bg-light", "style": "width: 20rem;" })
                        .append($('<img>', { "src": "http://localhost:8000/media/img/pkg1_KXc9EWW.png", "class": "card-img-top" }))
                        //.append($('<hr>'))
                        .append($('<div>', { "class": "card-body"})
                            .append($('<h5>', { "class": "card-title" }).text("Package Name"))
                            .append($('<p>', { "class": "card-text" }).text("Package long description here..."))
                        )
                        .append($('<div>', { "class": "card-footer"})
                            .append($('<button>', { "class": "btn btn-primary" }).text("Develop"))
                            .append($('<button>', { "class": "ml-1 btn btn-warning" }).text("Update"))
                            .append($('<button>', { "class": "ml-1 btn btn-danger" }).text("Publish"))
                            .append($('<hr>'))
                            .append($('<p>').text("Updated: Today"))
                        )
                    )
                )
                .append($('<div>', { "class": "col-auto mb-3" })
                    .append($('<div>', { "class": "card bg-light", "style": "width: 20rem;" })
                        .append($('<img>', { "src": "http://localhost:8000/media/img/pkg1_KXc9EWW.png", "class": "card-img-top" }))
                        //.append($('<hr>'))
                        .append($('<div>', { "class": "card-body"})
                            .append($('<h5>', { "class": "card-title" }).text("Package Name"))
                            .append($('<p>', { "class": "card-text" }).text("Package long description here... aaaaaaaaaaaaaaaaaaaaaa"))
                        )
                        .append($('<div>', { "class": "card-footer"})
                            .append($('<button>', { "class": "btn btn-primary" }).text("Develop"))
                            .append($('<button>', { "class": "ml-1 btn btn-warning" }).text("Update"))
                            .append($('<button>', { "class": "ml-1 btn btn-danger" }).text("Publish"))
                            .append($('<hr>'))
                            .append($('<p>').text("Updated: Today"))
                        )
                    )
                )
                .append($('<div>', { "class": "col-auto mb-3" })
                    .append($('<div>', { "class": "card bg-light", "style": "width: 20rem;" })
                        .append($('<img>', { "src": "http://localhost:8000/media/img/pkg1_KXc9EWW.png", "class": "card-img-top" }))
                        //.append($('<hr>'))
                        .append($('<div>', { "class": "card-body"})
                            .append($('<h5>', { "class": "card-title" }).text("Package Name"))
                            .append($('<p>', { "class": "card-text" }).text("Package long description here... aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))
                        )
                        .append($('<div>', { "class": "card-footer"})
                            .append($('<button>', { "class": "btn btn-primary" }).text("Develop"))
                            .append($('<button>', { "class": "ml-1 btn btn-warning" }).text("Update"))
                            .append($('<button>', { "class": "ml-1 btn btn-danger" }).text("Publish"))
                            .append($('<hr>'))
                            .append($('<p>').text("Updated: Today"))
                        )
                    )
                )
            )
        )
        .append($('<br>'))
        .append($('<p>', { "class": helpDocCls + " " + helpDocCls + "_stage" })
            .append($('<span>').text("Press "))
            .append($('<button>', { "class": "btn btn-primary"}).text("Develop"))
            .append($('<span>').text(" to go back to develiping, "))
            .append($('<button>', { "class": "btn btn-warning"}).text("Modify"))
            .append($('<span>').text(" to modify, "))
            .append($('<button>', { "class": "btn btn-danger"}).text("Publish"))
            .append($('<span>').text(" to publish your work to market in above card."))
        )
//        .append($('<p>').text("Press <Develop> button to go back to developing, <Update> to modify, or <Publish> to push your work to market!"))
        .append($('<hr>'))
        .append($('<h1>', { "class": "" })
            .append($('<span>', { "class": "badge badge-danger" }).text("　"))
            .append($('<span>').text(" Published"))
        )
        //.append($('<div>', { "class": "container", "id": "PublishedCardDeck" }) // card-deck will not reflect width css of card...
        .append($('<section>', { "class": "text-center mb-4", "id": publishDeckId })
            .append($('<div>', { "class": "row" })
                .append($('<div>', { "class": "col-auto mb-3" })
                    .append($('<div>', { "class": "card bg-light", "style": "width: 20rem;" })
                        .append($('<img>', { "src": "http://localhost:8000/media/img/pkg1_KXc9EWW.png", "class": "card-img-top" }))
                        //.append($('<hr>'))
                        .append($('<div>', { "class": "card-body"})
                            .append($('<h5>', { "class": "card-title" }).text("Package Name"))
                            .append($('<p>', { "class": "card-text" }).text("Package long description here..."))
                        )
                        .append($('<div>', { "class": "card-footer"})
                            .append($('<button>', { "class": "ml-1 btn btn-warning" }).text("Stage"))
                            .append($('<hr>'))
                            .append($('<p>').text("Updated: Today"))
                        )
                    )
                )
                .append($('<div>', { "class": "col-auto mb-3" })
                    .append($('<div>', { "class": "card bg-light", "style": "width: 20rem;" })
                        .append($('<img>', { "src": "http://localhost:8000/media/img/pkg1_KXc9EWW.png", "class": "card-img-top" }))
                        //.append($('<hr>'))
                        .append($('<div>', { "class": "card-body"})
                            .append($('<h5>', { "class": "card-title" }).text("Package Name"))
                            .append($('<p>', { "class": "card-text" }).text("Package long description here..."))
                        )
                        .append($('<div>', { "class": "card-footer"})
                            .append($('<button>', { "class": "ml-1 btn btn-warning" }).text("Stage"))
                            .append($('<hr>'))
                            .append($('<p>').text("Updated: Today"))
                        )
                    )
                )
            )
        )
        .append($('<br>'))
        .append($('<p>', { "class": helpDocCls + " " + helpDocCls + "_publish" })
            .append($('<span>').text("Press "))
            .append($('<button>', { "class": "btn btn-warning"}).text("Stage"))
            .append($('<span>').text(" in above card to push back to staging from market"))
        )
        .append($('<hr>'))
    );
}

class Layout {
    constructor() {
        this.ids = {
            container: '#' + containerId,
            develTable: '#' + develTableId,
            stageDeck: '#' + stageDeckId,
            publishDeck: '#' + publishDeckId,
            modal: '#' + modalId,
            modalForm: '#' + modalFormId,
        };
        this.classes = {
            helpDoc: '.' + helpDocCls,
        };
    }
    setup() {
        setupElements();
        
        $('#' + modalFormId).submit(function(e) {
            e.preventDefault();
            return false;
        });
        
    }
}

export default new Layout();
