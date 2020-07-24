/*
 * construct and show modal prompt
 */
'use strict';
//import 'jquery-validation';
//import 'jquery-validation/dist/additional-methods';
import iso6391 from 'iso-639-1';
import layout from './layout.js';

const setupModal = (title, form, rules) => {
    let ele = $(layout.ids.modal);
    ele.find(".modal-title").text(title);
    let modalForm = $(layout.ids.modalForm);
    modalForm.empty().append(form);
    
//    modalForm.validate(rules);

    ele.modal({
        backdrop: true,
        keyboard: true,
        focus: true,
        show: true
    });
}

const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

class Modal {
    constructor() {
        $(layout.ids.modalForm).submit(function(e) {
            e.preventDefault();
            return false;
        });
    }
    detail(pkg) {
        let lang = iso6391.getName(pkg.metadata.lang); // or getNativeName() ?
        let form = $('<div>', { "class": "row wow fadeIn", "style": "visibility: visible; animation-name: fadeIn;" })
        .append($('<div>', { "class": "col-md-6 mb-4" })
            .append($('<img>', { "class": "center-block", "id": "pkgCover", "src": pkg.image }))
        )
        .append($('<div>', { "class": "col-md-6 mb-4" })
            .append($('<div>')
                .append($('<span>', { "class": "badge badge-danger mr-1" }).text(Capitalize(pkg.category)))
            )
            .append($('<p>', { "class": "lead mb-1" })
                .append($('<span>', { "class": "mr-1" }).text(pkg.name))
            )
            .append($('<p>', { "class": "lead mb-1" })
                .append($('<span>', { "class": "mr-1" }).text(pkg.metadata.publisher))
            )
            .append($('<div>', { "class": "row wow fadeIn" })

                .append($('<nav>', { "class": "fadeIn mr-2 ml-3" })
                    .append($('<ul>', { "class": "pagination" })
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("Language")))
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text(lang)))
                    )
                )
                .append($('<nav>', { "class": "fadeIn" })
                    .append($('<ul>', { "class": "pagination" })
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("Age")))
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text(pkg.metadata.age)))
                    )
                )
            )
            .append($('<p>', { "class": "lead font-weight-bold" }).text("Description"))
            .append($('<p>').text(pkg.description))
            .append($('<div>', { "class": "row wow fadeIn"})
                .append($('<button>', { "class": "ml-4 btn btn-secondary mr-4" }).text("Cancel"))
                .append($('<button>', { "class": "btn btn-danger" }).text("Play"))
            )
        )
        ;
        let onSubmit = () => {
            return false; // don't reload publish page
        };
        let rules = {
            submitHandler: onSubmit,
        };
        setupModal("Detail", form, rules);
    }
}

export default new Modal();
