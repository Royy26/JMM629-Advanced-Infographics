# Can Data Spot a Hit Before It Airs?

An interactive infographic webpage based on the paper *Multi-Modal Supervised Learning for Improving Japanese Anime Audience Ratings Prediction*.

This repository now includes the final English submission package in `final project/`. The current final version is an evidence-first data story about what can be known before episode one airs, and which pre-broadcast clues most reliably point to a future TV hit.

## Final Project Structure

The final project is organized as a guided interactive story with these major sections:

- The World of Anime
- Five pre-broadcast signals
- Why metadata matters
- Core evidence across 31 combinations
- Time-slot evidence: one model, three markets
- Supporting station evidence
- Practical use before broadcast
- Case studies from the dataset
- Final takeaways

## Author

Sijie Huang

## Course

JMM629 Advanced Infographics

## Final Project Files

- `final project/index.html` — English final submission page
- `final project/style.css` — page layout and styling
- `final project/script.js` — D3 charts and interaction
- `final project/images/` — posters and visual assets
- `final project/vendor/` — local D3 and Scrollama files for offline viewing

## How to View Locally

Open `final project/index.html` in a browser.

Because this project is fully static, it does not require a build step or backend server. The chart libraries are bundled locally, so the page can be viewed offline.

## GitHub Pages

If GitHub Pages is enabled from:

- Branch: `main`
- Folder: `/ (root)`

the final English submission in this repository will be available at:

- `https://royy26.github.io/JMM629-Advanced-Infographics/final%20project/`

## Data Sources

- Video Research Ltd.
- MyAnimeList
- Japanese Wikipedia
- Shoboi Calendar

## Research Focus

The main takeaway of this final version is that before broadcast, the strongest predictive clues are not the plot summary alone, but the market context and visual identity around the show.

Metadata remains the strongest single signal, image helps more than synopsis text, and the full model performs best by only a very small margin over the strongest metadata-led combinations.

## Notes

This repository contains earlier course iterations as well as the final English submission package. For final-project review, use the files inside `final project/`.