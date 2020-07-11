/*
 * construct and show modal prompt
 */
'use strict';
import 'jquery-validation';
import 'jquery-validation/dist/additional-methods';
import iso6391 from 'iso-639-1';
import layout from './layout.js';
import remote from './remote.js';

const setupModal = (title, form, rules) => {
    let ele = $(layout.ids.modal);
    ele.find(".modal-title").text(title);
    let modalForm = $(layout.ids.modalForm);
    modalForm.empty().append(form);
    
    modalForm.validate(rules);

    ele.modal({
        backdrop: true,
        keyboard: true,
        focus: true,
        show: true
    });
}

class Modal {
    constructor() {
        /* we want page to be reloaded after pressing OK!
        $(layout.ids.modalForm).submit(function(e) {
            e.preventDefault();
            return false;
        });
        */
    }
    stage(stack) {
        let form = $('<div>')
        .append($('<div>', { "class": "form-group row"})
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgName"}).text("Pkg Name: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgName", "name": "pkgName", "data-errormsg": "#pkgNameErrorMsg","value": stack.title }))
                .append($('<div>', { "id": "pkgNameErrorMsg" }))))
        .append($('<div>', { "class": "form-group row" })
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgVersion"}).text("Pkg Version: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgVersion", "name": "pkgVersion", "data-errormsg": "#pkgVersionErrorMsg", "value": 1.0 }))
                .append($('<div>', { "id": "pkgVersionErrorMsg" }))))
        .append($('<div>', { "class": "form-group" })
            .append($('<div>', { "class": "input-group" })
                .append($('<div>', { "class": "input-group-prepend" })
                    .append($('<span>', { "class": "input-group-text" }).text("PNG Image")))
                .append($('<div>', { "class": "custom-file" })
                    .append($('<label>', { "class": "custom-file-label", "for": "pkgImage", "id": "pkgImageFileName" }).text("320 x 240 size"))
                    .append($('<input>', { "type": "file", "class": "custom-file-input", "id": "pkgImage", "name": "pkgImage", "data-errormsg": "#pkgImageErrorMsg" }))))
            .append($('<div>', { "id": "pkgImageErrorMsg"})))
        .append($('<div>', { "class": "text-center"})
            .append($('<img>', { "class": "center-block", "id": "pkgCover" })))
        .append($('<div>', { "class": "input-group" })
            .append($('<div>', { "class": "input-group-prepend" })
                .append($('<span>', { "class": "input-group-text" }).text("Description")))
            .append($('<textarea>', { "class": "form-control", "id": "pkgDesc", "name": "pkgDesc", "data-errormsg": "#pkgDescErrorMsg" }).text("Explain your package here")))
        .append($('<div>', { "class": "form-group", "id": "pkgDescErrorMsg" }))
        // metadata of pkg
        .append($('<div>', { "class": "form-group row" })
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgAgeLimit"}).text("Above Age: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "pkgAgeLimit", "name": "pkgAgeLimit", "data-errormsg": "#pkgAgeErrorMsg", "value": 5 }))
                .append($('<div>', { "id": "pkgAgeErrorMsg" }))))
        .append($('<div>', { "class": "form-group row" })
            .append($('<label>', { "class": "col-form-label col-3", "for": "pkgLanguage"}).text("Language: "))
            .append($('<div>', { "class": "col-9" })
                .append($('<select>', { "class": "form-control", "id": "pkgLanguage", "name": "pkgLanguage", "data-errormsg": "#pkgLanguageErrorMsg"  }))
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
            if (code == 'en') {
                langele.append($('<option>', { "value": code, "selected": true }).text(iso6391.getNativeName(code)));
            } else {
                langele.append($('<option>', { "value": code }).text(iso6391.getNativeName(code)));
            }
        });

        let onSubmit = () => {
            let name = $('#pkgName').val();
            let author = stack.author;
            let stackid = stack.id;
            let version = Number.parseFloat($('#pkgVersion').val());
            let desc = $('#pkgDesc').val();
            let metadata = {
                age: Number.parseInt($('#pkgAgeLimit').val()),
                lang: $('#pkgLanguage').val()
            }
            let file = $('#pkgImage').prop('files')[0];
            let fd = new FormData();
            fd.append('name', name);
            fd.append('author', author);
            fd.append('stack', stackid);
            fd.append('version', version);
            fd.append('description', desc);
            fd.append('image', file);
            fd.append('metadata', JSON.stringify(metadata));

            remote.postPackage(fd);

            return true; // close modal and reload publish page
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
                pkgVersion: {
                    required: true,
                    number: true,
                    min: 0,
                },
                pkgImage: {
                    required: true,
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
        setupModal("Staging", form, rules);

    }
    publish() {

    }
}

export default new Modal();
