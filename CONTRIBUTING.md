# Contributing to the Zeekr Insiders wiki

Thanks for helping. The wiki is written by owners for owners, and every fix makes it more useful.

## Spotted something wrong?

The quickest help is an issue: [report an error](https://github.com/zeekr-insiders/wiki/issues/new?template=report-an-error.yml) with the page, what's wrong and a source we can check. Got an idea for a page? [Suggest a page](https://github.com/zeekr-insiders/wiki/issues/new?template=suggest-a-page.yml).

Questions about your car are better asked on the [forum](https://forums.zeekrinsiders.com.au/).

## Suggest an edit

1. On any wiki page, follow **Suggest an edit** at the foot of the page (or **Contribute** in the footer). It opens the page's Markdown in GitHub's editor.
2. Make your change and propose it. GitHub forks the repo for you and opens a pull request.
3. Fill in the pull request template. A maintainer reviews it and may ask questions before it goes live.

For bigger changes (a new page, a reorganised section), clone the repo, then:

```bash
make install   # needs uv: https://docs.astral.sh/uv/
make run       # preview on http://localhost:8000
make ready     # run all the checks before you open a pull request
```

## The sources rule

Every fact needs a source a reader can check.

- Put a footnote marker straight after the fact: `The MY27 7X keeps the same prices [^1].`
- Add the entry under the page's `## Sources` heading, with publisher, title, URL and the date you accessed it:

    ```markdown
    [^1]: CarExpert, "2027 Zeekr 7X update: more power, same price", <https://www.carexpert.com.au/car-news/2027-zeekr-7x-update-more-power-same-price>, accessed 8 November 2026.
    ```

- Update `last_checked` in the page's front matter when you check its facts.
- If you changed a page meaningfully (a new figure, a corrected fact, a new section), add a one-line `changelog:` to its front matter, such as `changelog: "Added MY27 towing figure"`. The wiki's update feed and the club site show it as what changed.
- If a fact isn't confirmed, or sources disagree, say so on the page.
- Say which model year a figure is for: MY25/MY26 or MY27.

`make ready` fails if a marker has no entry or an entry is never cited.

## Style

Australian English, plain and friendly, no hype and no em dashes. Write as one owner explaining something to another. [AGENTS.md](AGENTS.md) has the full guide, including colour, accessibility and diagrams.

## AI use

AI tools are welcome for research and drafting, as long as a person checks every fact against its source. Say what you used in the pull request's **AI use disclosure**. Our policy: [How we use AI](https://zeekrinsiders.com.au/ai).

## Licensing your contribution

By opening a pull request you agree that:

- your text contributions are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), like the rest of the wiki's content;
- your code contributions (theme, hooks, scripts, JavaScript and CSS) are licensed under the [MIT licence](LICENSE);
- you have the right to submit any image you add, and you state its source and licence in the pull request.

Images aren't covered by either licence; [LICENSE-CONTENT.md](LICENSE-CONTENT.md) sets out who owns what.

## Images and privacy

Only add images you have the right to use, and say where each came from. Don't include anyone's personal details (names, phone numbers, number plates, VINs) without their consent.

## How changes go live

Pull requests are checked automatically (strict build plus the citation, label, nav and search checks). Once a maintainer merges to `main`, the site rebuilds and publishes to <https://wiki.zeekrinsiders.com.au> within a few minutes.
