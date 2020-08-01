/*
 * class to update data in page layout
 */
'use strict';

import layout from './layout.js';
import remote from './remote.js';
import modal from './modal.js';

const createCard = (pkg) => {
    let card = $('<div>', { "class": "col-lg-3 col-md-6 mb-4" })
    .append($('<div>', { "class": "card bg-light" })
        .append($('<div>', { "class": "", "style": "cursor:pointer;" }).click(()=>{ modal.detail(pkg); })
            .append($('<div>', { "class": "view overlay" })
                .append($('<img>', { "src": pkg.image, "style": "width: 100%;" }))
            )
            .append($('<div>', { "class": "card-body text-center" })
                .append($('<p>', { "class": "lead mb-0" }).text(pkg.name))
                .append($('<footer>', { "class": "backquote-footer" }).text(pkg.metadata.publisher))
            )
        )
    );
    return card;
};

class Update {
    constructor() {
        this.page_offset = 0;
    }
    render() {
         // cleanup
        $(layout.ids.section).empty();
        $(layout.ids.pagination).empty();
        let updatePackages = (data) => {
            let divtop = $('<div>');
            let divrow = null;
            let count = 0;

            if (data == null) {
                return;
            }
            let packages = data.results;
            packages.forEach(pkg => {
                if (count % 4 == 0) {
                    divrow = $('<div>', { "class": "row wow fadeIn" });
                    divtop.append(divrow);
                }
                divrow.append(createCard(pkg));
                count++;
            });
            if (count) {
                $(layout.ids.section).append(divtop);
            }

            // update pagination
            // update pagination previous
            if (data.previous == null) {
                $(layout.ids.pagination)
                .append($('<li>', { "class": "page-item disabled" })
                    .append($('<div>', { "class": "page-link waves-effect" }).text("Previous")));
            } else {
                $(layout.ids.pagination)
                .append($('<li>', { "class": "page-item", "style": "cursor:pointer;" }).click(() => {
                    this.page_offset = (new URL(data.previous)).searchParams.get('offset');
                    this.render();
                })
                    .append($('<div>', { "class": "page-link waves-effect" }).text("Previous")));
            }
            // update pagination page nums (each page shows 8 decks)
            for (let i = 0; i < data.count / 8; i++) {
                $(layout.ids.pagination)
                .append($('<li>', { "class": "page-item", "style": "cursor:pointer;" }).click(() => {
                    this.page_offset = i * 8;
                    this.render();
                })
                    .append($('<div>', { "class": "page-link waves-effect" }).text(i + 1)));
            }
            // update pagination next
            if (data.next == null) {
                $(layout.ids.pagination)
                .append($('<li>', { "class": "page-item disabled" })
                    .append($('<div>', { "class": "page-link waves-effect" }).text("Next")));
            } else {
                $(layout.ids.pagination)
                .append($('<li>', { "class": "page-item", "style": "cursor:pointer;" }).click(() => {
                    this.page_offset = (new URL(data.next)).searchParams.get('offset');
                    this.render();
                })
                    .append($('<div>', { "class": "page-link waves-effect" }).text("Next")));
            }
        };
        remote.getPublishedPackages(updatePackages, this.page_offset);
   }
}

export default new Update();
