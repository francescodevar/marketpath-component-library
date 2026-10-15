export default {
  "id": "banner-02",
  "name": "Experience & Contact Banner",
  "category": "banner",
  "prefix": "banner_02_",
  "bootstrap": true,
  "customCss": true,
  "customJs": false,
  "bootstrapJs": false,
  "description": "Pair a headline experience number with location and email pulled from site settings.",
  "tags": [
    "contact",
    "stats",
    "two-column"
  ],
  "template": "{%- if entity.banner_02_experience_number.is_valid -%}\n<section class=\"highlights m-0 p-0\">\n  <div class=\"container-fluid m-0 p-0\">\n    <div class=\"col-12 col-lg-10 offset-lg-2 bg-dark bg-opacity-10\">\n      <div style=\"max-width: 1200px\" class=\"m-0 p-0\">\n        <div class=\"row p-0 m-0\">\n          <div class=\"col-12 col-md-6 col-lg-5 bg-light p-4\">\n            <div class=\"row ps-3 g-2 flex-nowrap align-items-center\">\n              <div class=\"col-auto\">\n                <div class=\"d-flex align-items-center text-nowrap\">\n                  <span class=\"text-primary display-1 fw-bold lh-1\">\n                    {{ entity.banner_02_experience_number }}\n                  </span>\n                  <span class=\"text-primary fs-5 ms-1 mt-1\">+</span>\n                </div>\n              </div>\n              <div class=\"col d-flex flex-column justify-content-center\">\n                <div>Years of</div>\n                <div class=\"display-5 fw-bold lh-1\">Experience</div>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-12 col-md-6 col-lg-7 ps-lg-5\">\n            <div class=\"row d-flex align-items-center h-100 p-3\">\n              {%- if settings.company_address.is_valid -%}\n              <div class=\"col-12 col-lg-6 d-flex align-items-center p-2\">\n                <a href=\"https://maps.google.com/?q={{ settings.company_address | escape }}\" class=\"row w-100 text-decoration-none text-reset\">\n                  <div class=\"col-2 d-flex align-items-center justify-content-center\">\n                    <div class=\"highlight-icon rounded-circle bg-light text-dark d-flex align-items-center justify-content-center flex-shrink-0\" style=\"width: 40px; height: 40px;\">\n                      <i class=\"bi bi-geo-alt-fill\"></i>\n                    </div>\n                  </div>\n                  <div class=\"col-10 ps-lg-3 mb-3 mb-lg-0\">\n                    <div class=\"text-uppercase mb-0 text-body-secondary text-small\">Our Location</div>\n                    <div class=\"fw-bold\">\n                      {{ settings.company_address }}\n                    </div>\n                  </div>\n                </a>\n              </div>\n              {%- endif -%}\n              {%- if settings.company_email.is_valid -%}\n              <div class=\"col-12 col-lg-6 d-flex align-items-center p-2\">\n                <a href=\"mailto:{{ settings.company_email | escape }}\" class=\"row w-100 text-decoration-none text-reset\">\n                  <div class=\"col-2 d-flex align-items-center justify-content-center\">\n                    <div class=\"highlight-icon rounded-circle bg-light text-dark d-flex align-items-center justify-content-center flex-shrink-0\" style=\"width: 40px; height: 40px;\">\n                      <i class=\"bi bi-envelope-fill\"></i>\n                    </div>\n                  </div>\n                  <div class=\"col-10 ps-lg-3 mb-3 mb-lg-0\">\n                    <div class=\"text-uppercase mb-0 text-body-secondary text-small\">Send Us an Email</div>\n                    <div class=\"fw-bold\">\n                      {{ settings.company_email }}\n                    </div>\n                  </div>\n                </a>\n              </div>\n              {%- endif -%}\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>\n{%- endif -%}",
  "fields": [
    {
      "Type": "group",
      "Label": "Experience Banner",
      "Condition": null,
      "Collapsible": true,
      "Fields": [
        {
          "Type": "text",
          "FieldID": "banner_02_experience_number",
          "Label": "Experience number (required)",
          "Condition": null,
          "IsRequired": true,
          "Placeholder": "e.g. 41"
        }
      ]
    }
  ],
  "notes": [
    "Only the experience number is a custom field (prefix banner_02_). Location and email come from the global settings object.",
    "Location reads settings.company_address and links to a Google Maps search; email reads settings.company_email with a mailto: link.",
    "The required experience number controls section visibility; the + and the Years of / Experience labels are fixed in the template.",
    "Icons use Bootstrap Icons (bi bi-geo-alt-fill, bi bi-envelope-fill); load the Bootstrap Icons stylesheet on the page. One inline rule sets the card max-width to 1200px and the icon circles to 40x40."
  ],
  "preview": {
    "html": "<section class=\"highlights m-0 p-0\">\n  <div class=\"container-fluid m-0 p-0\">\n    <div class=\"col-12 col-lg-10 offset-lg-2 bg-dark bg-opacity-10\">\n      <div style=\"max-width: 1200px\" class=\"m-0 p-0\">\n        <div class=\"row p-0 m-0\">\n          <div class=\"col-12 col-md-6 col-lg-5 bg-light p-4\">\n            <div class=\"row ps-3 g-2 flex-nowrap align-items-center\">\n              <div class=\"col-auto\">\n                <div class=\"d-flex align-items-center text-nowrap\">\n                  <span class=\"text-primary display-1 fw-bold lh-1\">41</span>\n                  <span class=\"text-primary fs-5 ms-1 mt-1\">+</span>\n                </div>\n              </div>\n              <div class=\"col d-flex flex-column justify-content-center\">\n                <div>Years of</div>\n                <div class=\"display-5 fw-bold lh-1\">Experience</div>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-12 col-md-6 col-lg-7 ps-lg-5\">\n            <div class=\"row d-flex align-items-center h-100 p-3\">\n              <div class=\"col-12 col-lg-6 d-flex align-items-center p-2\">\n                <a href=\"https://maps.google.com/?q=18%20Poplar%20Avenue%2C%20Scituate%2C%20Massachusetts\" class=\"row w-100 text-decoration-none text-reset\">\n                  <div class=\"col-2 d-flex align-items-center justify-content-center\">\n                    <div class=\"highlight-icon rounded-circle bg-light text-dark d-flex align-items-center justify-content-center flex-shrink-0\" style=\"width: 40px; height: 40px;\">\n                      <i class=\"bi bi-geo-alt-fill\"></i>\n                    </div>\n                  </div>\n                  <div class=\"col-10 ps-lg-3 mb-3 mb-lg-0\">\n                    <div class=\"text-uppercase mb-0 text-body-secondary text-small\">Our Location</div>\n                    <div class=\"fw-bold\">18 Poplar Avenue, Scituate, Massachusetts</div>\n                  </div>\n                </a>\n              </div>\n              <div class=\"col-12 col-lg-6 d-flex align-items-center p-2\">\n                <a href=\"mailto:info@marketpath.com\" class=\"row w-100 text-decoration-none text-reset\">\n                  <div class=\"col-2 d-flex align-items-center justify-content-center\">\n                    <div class=\"highlight-icon rounded-circle bg-light text-dark d-flex align-items-center justify-content-center flex-shrink-0\" style=\"width: 40px; height: 40px;\">\n                      <i class=\"bi bi-envelope-fill\"></i>\n                    </div>\n                  </div>\n                  <div class=\"col-10 ps-lg-3 mb-3 mb-lg-0\">\n                    <div class=\"text-uppercase mb-0 text-body-secondary text-small\">Send Us an Email</div>\n                    <div class=\"fw-bold\">info@marketpath.com</div>\n                  </div>\n                </a>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</section>"
  },
  "mockData": {
    "experience_number": "41"
  }
};
