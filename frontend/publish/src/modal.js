/*
 * construct and show modal prompt
 */
'use strict';
import 'jquery-validation';
import 'jquery-validation/dist/additional-methods';
import iso6391 from 'iso-639-1';
import layout from './layout.js';
import remote from './remote.js';
import update from './update.js';

const setupModal = (title, form, rules, footer) => {
    let ele = $(layout.ids.modal);
    ele.find(".modal-title").text(title);
    let formParent = $(layout.ids.modalForm).parent();
    let modalForm;
    let modalFooter = ele.find(".modal-footer");

    // re-create new <form> element every time modal is called, so modalForm.validate() will properly set submitHandler.
    formParent.empty();
    formParent.append($('<form>', { "id": layout.ids.modalForm.substr(1) }).append(form));
    modalForm = $(layout.ids.modalForm);
    modalForm.submit((e) => {
        e.preventDefault();
        return false;
    });
    modalForm.validate(rules);

    modalFooter.empty();
    if (footer) {
        modalFooter.append(footer);
    } else {
        modalFooter
        .append($('<button>', { "class": "btn btn-secondary", "type": "button", "data-dismiss": "modal" }).text("Cancel"))
        .append($('<button>', { "class": "btn btn-primary", "type": "submit", "form": layout.ids.modalForm.substr(1) }).text("Submit"))
        ;
    }

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
    }
    stage(stk, pkg) {
        let name = pkg != null ? pkg.name : stk.title;
        let version = pkg != null ? pkg.version : 1.0;
        let desc = pkg != null ? pkg.description : "Explain your package here";
        let srcimage = pkg != null ? pkg.image : null; // @todo: reuse image in server if pkg exists (remove required also)
        //let srcimage = null;
        let age = pkg != null ? pkg.metadata.age : 5;
        let lang = pkg != null ? pkg.metadata.lang : "en";
        let pub = pkg != null ? pkg.metadata.publisher : remote.getMyData().username;
        let form = $('<div>')
        .append($('<div>', { "class": "form-group row"})
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgName"}).text("Pkg Name: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgName", "name": "pkgName", "data-errormsg": "#pkgNameErrorMsg","value": name }))
                .append($('<div>', { "id": "pkgNameErrorMsg" }))))
        .append($('<div>', { "class": "form-group row"})
            .append($('<label>', { "class": "col-form-label col-3", "for": "publisherName"}).text("Publisher Name: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "publisherName", "name": "publisherName", "data-errormsg": "#publisherNameErrorMsg", "value": pub }))
                .append($('<div>', { "id": "publisherNameErrorMsg" }))))
        .append($('<div>', { "class": "form-group row" })
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgVersion"}).text("Pkg Version: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgVersion", "name": "pkgVersion", "data-errormsg": "#pkgVersionErrorMsg", "value": version }))
                .append($('<div>', { "id": "pkgVersionErrorMsg" }))))
        .append($('<div>', { "class": "form-group" })
            .append($('<div>', { "class": "input-group" })
                .append($('<div>', { "class": "input-group-prepend" })
                    .append($('<span>', { "class": "input-group-text" }).text("PNG Image")))
                .append($('<div>', { "class": "custom-file" })
                    .append($('<label>', { "class": "custom-file-label", "for": "pkgImage", "id": "pkgImageFileName" }).text(srcimage ? srcimage.split('/').pop() : "320 x 240 size"))
                    .append($('<input>', { "type": "file", "class": "custom-file-input", "id": "pkgImage", "name": "pkgImage", "data-errormsg": "#pkgImageErrorMsg" }))))
            .append($('<div>', { "id": "pkgImageErrorMsg"})))
        .append($('<div>', { "class": "text-center mb-2"})
            .append($('<img>', { "class": "center-block", "id": "pkgCover", "src": srcimage })))
        .append($('<div>', { "class": "input-group" })
            .append($('<div>', { "class": "input-group-prepend" })
                .append($('<span>', { "class": "input-group-text" }).text("Description")))
            .append($('<textarea>', { "class": "form-control", "id": "pkgDesc", "name": "pkgDesc", "data-errormsg": "#pkgDescErrorMsg" }).text(desc)))
        .append($('<div>', { "class": "form-group", "id": "pkgDescErrorMsg" }))
        // metadata of pkg
        .append($('<div>', { "class": "form-group row" })
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgAgeLimit"}).text("Above Age: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgAgeLimit", "name": "pkgAgeLimit", "data-errormsg": "#pkgAgeErrorMsg", "value": age }))
                .append($('<div>', { "id": "pkgAgeErrorMsg" }))))
        .append($('<div>', { "class": "form-group row" })
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgLanguage"}).text("Language: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<select>', { "class": "form-control", "id": "pkgLanguage", "name": "pkgLanguage", "data-errormsg": "#pkgLanguageErrorMsg" }))
                .append($('<div>', { "id": "pkgLanguageErrorMsg" }))))
        ;

        form.find('#pkgImage').change((e) => {
            $('#pkgCover').attr('src', '');
            let file = $('#pkgImage').prop('files')[0];
            if (!file) { // file select is cancelled
                return;
            }
            $('#pkgImageFileName').text(file.name);
            if (file.type != "image/png") {
                $('#pkgImageFileName').text("(Error: Not PNG file)");
                return;
            }
            // check width, height
            let URL = window.URL || window.webkitURL;
            let src = URL.createObjectURL(file);
            let img = new Image();
            img.src = src;
            img.onload = () => {
                if (img.width > 320) {
                    $('#pkgImageFileName').text("(Error: PNG width > 320)");
                    return;
                }
                if (img.height > 240) {
                    $('#pkgImageFileName').text("(Error: PNG height > 240)");
                    return;
                }
                $('#pkgCover').attr('src', img.src);
                URL.revokeObjectURL(src);
            };
        });

        let langlist = iso6391.getAllCodes();
        let langele = form.find('#pkgLanguage');
        langlist.forEach((code) => {
            if (code == lang) {
                langele.append($('<option>', { "value": code, "selected": true }).text(iso6391.getNativeName(code)));
            } else {
                langele.append($('<option>', { "value": code }).text(iso6391.getNativeName(code)));
            }
        });

        let onSubmit = () => {
            console.log("stage onSubmit");
            let name = $('#pkgName').val();
            let author = Number.parseInt(remote.getMyData().id);
            let stackid = stk.id;
            let version = Number.parseFloat($('#pkgVersion').val());
            let desc = $('#pkgDesc').val();
            let metadata = {
                age: Number.parseInt($('#pkgAgeLimit').val()),
                lang: $('#pkgLanguage').val(),
                publisher: $('#publisherName').val(),
            }
            let files = $('#pkgImage').prop('files');
            let file = files.length > 0 ? files[0] : null;
            let fd = new FormData();
            fd.append('name', name);
            fd.append('author', author);
            fd.append('stack', stackid);
            fd.append('version', version);
            fd.append('description', desc);
            fd.append('image', file);
            fd.append('metadata', JSON.stringify(metadata));
            fd.append('category', "playable");
            fd.append('available', false);

            stk.status = "staging";
            if (pkg == null) {
                remote.postPackage(stk, fd);
            } else {
                // handle pkg.image properly, dont update if image file selected locally is empty
                if (!file) {
                    fd.delete('image');
                }
                remote.putPackage(stk, pkg, fd); // @todo: implement later...
            }
            // redraw with 3 sec interval (for server to reflect updated data)
            // use await / promise ?
            setTimeout(() => {
                $(layout.ids.modal).modal('hide');
                update.render();
            }, 3000);
        };
        let rules = {
            submitHandler: onSubmit,
            //errorClass: "invalid",
            //validClass: "success",
            //success: "valid",
            //errorElement: "span",
            rules: {
                pkgName: {
                    required: true,
                    rangelength: [3,128],
                },
                publisherName: {
                    required: true,
                    rangelength: [3,128],
                },
                pkgVersion: {
                    required: true,
                    number: true,
                    min: 0,
                },
                pkgImage: {
                    required: pkg != null ? false : true,
                    extension: 'png',
                    accept: 'image/png',
                },
                pkgDesc: {
                    required: true,
                    rangelength: [3,4096],
                },
                pkgAgeLimit: {
                    required: true,
                    digits: true,
                },
            },
            errorPlacement: (err, ele) => {
                err.appendTo(ele.data('errormsg'));
            },
            /*
            messages: {
            }
            */
        };
        setupModal("Staging", form, rules, null);

    }
    publish(stk, pkg) {
        let form = $('<div>')
        .append($('<div>', { "class": "form-group row"})
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgName"}).text("Pkg Name: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgName", "name": "pkgName", "readonly": true, "value": pkg.name }))
            )
        )
        .append($('<div>', { "class": "text-center mb-2"})
            .append($('<img>', { "class": "center-block", "id": "pkgCover", "src": pkg.image }))
        )
        .append($('<div>', { "class": "form-group row"})
                .append($('<label>', { "class": "col-form-label col-3", "for": "pkgPublish"}).text("Publish: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<select>', { "class": "form-control", "id": "pkgPublish", "name": "pkgPublish" })
                    .append($('<option>', { "value": false, "selected": true }).text("False"))
                    .append($('<option>', { "value": true }).text("True"))
                )
            )
        )
        ;

        let onSubmit = () => {
            console.log("publish onSubmit");
            let available = $('#pkgPublish').val() === "true";
            let fd = new FormData();
            fd.append('available', available);
            stk.status = available ? "publish" : "staging";
            remote.putPackage(stk, pkg, fd);
            setTimeout(() => {
                $(layout.ids.modal).modal('hide');
                update.render();
            }, 3000);
        };
        let rules = {
            submitHandler: onSubmit,
        };
        setupModal("Publishing", form, rules, null);
    }
    develop(stk, pkg) {
        // tansition package from staging to developing. just update stack status, no change to package
        let form = $('<div>', { "class": "alert alert-warning", "role": "alert" })
        .append($('<h5>', { "class": "alert-heading" }).text("Transfer to development"))
        .append($('<p>').text("Moving packge: \"" + pkg.name + "\" which contains stack: \"" + stk.title + "\" from staging to development phase."))
        .append($('<hr>'))
        .append($('<p>', { "class": "mb-0" }).text("Press \"Submit\" if it's OK"))
        ;
        let onSubmit = () => {
            console.log("develop onSubmit");
            stk.status = "develop";
            remote.putStackStatus(stk);
            setTimeout(() => {
                $(layout.ids.modal).modal('hide');
                update.render();
            }, 3000);
        };
        let rules = {
            submitHandler: onSubmit,
        };
        setupModal("Developing", form, rules, null);
    }
    delete(stk, pkg) {
        let form = $('<div>', { "class": "alert alert-danger", "role": "alert" })
        .append($('<h5>', { "class": "alert-heading" }).text("Deleting Package"))
        .append($('<p>').text("Going to delete packge: \"" + pkg.name + "\" which contains stack: \"" + stk.title + "\" forever!."))
        .append($('<hr>'))
        .append($('<p>', { "class": "mb-0" }).text("Press \"Submit\" if it's OK"))
        ;
        let onSubmit = () => {
            console.log("delete onSubmit");
            stk.status = "develop";
            remote.deletePackage(stk, pkg);
            setTimeout(() => {
                $(layout.ids.modal).modal('hide');
                update.render();
            }, 3000);
        };
        let rules = {
            submitHandler: onSubmit,
        };
        setupModal("Deleting", form, rules, null);
    }
    detail(stk, pkg) {
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
            .append($('<footer>', { "class": "backquote-footer mb-1" })
                .append($('<span>', { "class": "mr-1" }).text(pkg.metadata.publisher))
            )
            .append($('<div>', { "class": "row wow fadeIn" })

                .append($('<nav>', { "class": "fadeIn mr-2 ml-3" })
                    .append($('<ul>', { "class": "pagination pagination-sm" })
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("Language")))
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text(lang)))
                    )
                )
                .append($('<nav>', { "class": "fadeIn mr-2" })
                    .append($('<ul>', { "class": "pagination pagination-sm" })
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("Age")))
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text(pkg.metadata.age)))
                    )
                )
                .append($('<nav>', { "class": "fadeIn mr-2" })
                    .append($('<ul>', { "class": "pagination pagination-sm" })
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text("Version")))
                        .append($('<li>', { "class": "page-item disabled" })
                            .append($('<a>', { "class": "page-link waves-effect", "href": "#" }).text(pkg.version)))
                    )
                )
            )
            .append($('<p>', { "class": "lead font-weight-bold" }).text("Description"))
            .append($('<p>').text(pkg.description))
            .append($('<hr>'))
            .append($('<p>').text("Updated: " + pkg.updated_at))
        )
        ;
        let footer = $('<button>', { "class": "btn btn-secondary", "type": "button", "data-dismiss": "modal" }).text("Cancel");

        let onSubmit = () => {
            console.log("detail onSubmit");
            setTimeout(() => {
                $(layout.ids.modal).modal('hide');
                update.render();
            }, 3000);
            return false; // don't reload publish page
        };
        let rules = {
            submitHandler: onSubmit,
        };
        setupModal("Detail Preview", form, rules, footer);
    }
}

export default new Modal();
