/*
 * layout.js: Set components to body
 */
'use strict';

const containerId = "MainFrameId";
const sectionId = "PackageCardsId";
const paginationId = "PaginationId";
const modalId = "ModalTop";
const modalFormId = "modalForm";

let setupElements = () => {
    // modal to show package detail
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
                    .append($('<button>', { "class": "btn btn-secondary mr-2", "type": "button", "data-dismiss": "modal" }).text("Cancel"))
                    .append($('<button>', { "class": "btn btn-danger", "type": "submit", "form": "modalForm"}).text("Play"))
                )
                
            )
        )
    );

    // to be changed to carousel, maybe
    $('body')
    .append($('<div>', { "class": "jumbotron jumbotron-fluid p-5 m-5"})
        .append($('<h1>', { "class": "display-4" }).text("Find awesome decks in the market!"))
        .append($('<hr>'))
        .append($('<p>').text("Cagegories and search is just a mock for now..."))
    );

    // main container view
    $('body')
    .append($('<div>', { "class": "container", "id": containerId })
        //! todo: to add search by name, category, etc
        .append($('<nav>', { "class": "navbar navbar-expand-lg navbar-light bg-light mt-3 mb-5" })
            .append($('<span>', { "class": "navbar-brand" }).text("Categories"))
            .append($('<button>', { "class": "navbar-toggler", "type": "button", "data-toggle": "collapse", "data-target": "#navbarCategoryNav" })
                .append($('<span>', { "class": "navbar-toggle-icon" }))
            )
            .append($('<div>', { "class": "collapse navbar-collapse", "id": "navbarCategoryNav" })
                .append($('<ul>', { "class": "navbar-nav mr-auto" })
                    .append($('<li>', { "class": "nav-item active" })
                        .append($('<a>', { "class": "nav-link waves-effect waves-light", "href": "#" }).text("All")))
                    .append($('<li>', { "class": "nav-item" })
                        .append($('<a>', { "class": "nav-link waves-effect waves-light", "href": "#" }).text("Playables")))
                    .append($('<li>', { "class": "nav-item" })
                        .append($('<a>', { "class": "nav-link waves-effect waves-light", "href": "#" }).text("Tutorials")))
                    .append($('<li>', { "class": "nav-item" })
                        .append($('<a>', { "class": "nav-link waves-effect waves-light", "href": "#" }).text("Plugins")))
                )
                .append($('<form>', { "class": "form-inline" })
                    .append($('<div>', { "class": "md-form my-0" })
                        .append($('<input>', { "class": "form-control mr-sm-2", "type": "search", "placeholder": "Search" })))
                )
            )
        )
        .append($('<section>', { "class": "text-center mb-4", "id": sectionId }))
        .append($('<nav>', { "class": "d-flex justify-content-center wow fadeIn" })
            .append($('<ul>', { "class": "pagination", "id": paginationId })
                .append($('<li>', { "class": "page-item disabled" })
                    .append($('<a>', { "class": "page-link waves-effect", "href": "#" })
                        .append($('<span>').html('&laquo;'))))
                .append($('<li>', { "class": "page-item" })
                    .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("1")))
                .append($('<li>', { "class": "page-item" })
                    .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("2")))
                .append($('<li>', { "class": "page-item" })
                    .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("3")))
                .append($('<li>', { "class": "page-item" })
                    .append($('<a>', { "class": "page-link waves-effect", "href": "#" })
                        .append($('<span>').html('&raquo;')))
                )
            )
        )
    );

}

 class Layout {
    constructor() {
        this.ids = {
            container: '#' + containerId,
            section: '#' + sectionId,
            pagination: '#' + paginationId,
            modal: '#' + modalId,
            modalForm: '#' + modalFormId,
        };
        this.classes = {
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
