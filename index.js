const puppeteer = require("puppeteer");
const { EMAIL, PASSWORD } = require("./config");
// IMPORTANTE: la aplicacion es con fines didacticos y es solo un demo por lo que no funciona perfectamente.
// IMPORTANTE: La funcion esta probada solo en el navegador GoogleChrome

// Crear un archito config.js con las variables EMAIL y PASSWORD
const email = EMAIL;
const password = PASSWORD;

// puede modificar esta variable por la empresa que quiera buscar anteponiendo siempre la palabra recruiter
// ejemplo "recruiter Accenture"

const recruiterCompany = "recruiter CoderHouse";

(async function () {
  //puede cambiar el parametro headless a true para que no se habra el explorador
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/uas/login");
  await page.type("#username", email);
  await page.type("#password", password);
  await page.click(".login__form_action_container button");

  // puede ser que al usarse demasiadas veces pida una verificacion por lo que debe verificarlo manualmente
  //puede modificar page.waitForTimeout(20000) si necesita mas tiempo para verificar por un numero mas grande

  await page.waitForTimeout(20000);
  await page.click("#global-nav-search button");
  await page.type("#global-nav-typeahead input", recruiterCompany);

  await page.keyboard.press("Enter");

  await page.waitForSelector(".search-reusables__primary-filter");
  await page.click(".search-reusables__primary-filter button");

  await page.waitForTimeout(2000);

  async function sendInvitation(page) {
    await page.waitForTimeout(3000);
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(5000);
      await page.evaluate(async () => {
        const recruiters = document.querySelectorAll(
          ".reusable-search__result-container"
        );
        recruiters.forEach((element, index) => {
          setInterval(() => {
            const buttonAdd =
              element.firstElementChild.firstElementChild.lastElementChild
                .firstElementChild;
            if (
              buttonAdd.ariaLabel.includes("Retirar") ||
              buttonAdd.ariaLabel.includes("Seguir")
            ) {
              console.log("isPendding");
            } else {
              buttonAdd.click();
            }

            const clickSend = document.getElementsByClassName(
              "artdeco-button artdeco-button--2 artdeco-button--primary ember-view ml1"
            )[0];

            clickSend && clickSend.click();
          }, index * 1000);
        });
      });
      await page.waitForTimeout(10000);
      await page.evaluate((i) => {
        window.scroll(0, 4000);
        setInterval(() => {
          const buttonNext = document.querySelector(
            "button[aria-label=Siguiente]"
          );

          buttonNext.click();
        }, i * 20000);
      });
    }
  }
  await sendInvitation(page);

  await browser.close();
})();
