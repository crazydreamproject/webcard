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
        .append($('<a>', { "href": "#" }).click(()=>{ modal.detail(pkg); })
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
    return card;
};

class Update {
    constructor() {

    }
    render() {
         // cleanup
        $(layout.ids.section).empty();
        $(layout.ids.pagination).empty();
        let updatePackages = (data) => {
            let divtop = $('<div>');
            let divrow = null;
            let count = 0;

            console.log(data);
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
        };
        remote.getPublishedPackages(updatePackages);
   }
}

export default new Update();
