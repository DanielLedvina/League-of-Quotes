import requests
from bs4 import BeautifulSoup
import json
import shutil
import os

champion_pfp_dir = os.path.join('server', 'assets', 'champion-pfp')
splashart_dir = os.path.join('server', 'assets', 'champion-splashart')
figure_dir = os.path.join('server', 'assets', 'champion-figure')
os.makedirs(splashart_dir, exist_ok=True)
os.makedirs(figure_dir, exist_ok=True)
os.makedirs(champion_pfp_dir, exist_ok=True)


# Function to download images
def download_image(url, path):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(path, 'wb') as out_file:
                shutil.copyfileobj(response.raw, out_file)
            print(f"Downloaded image successfully: {path}")
        else:
            print(f"Failed to download image from {url} - Status code: {response.status_code}")
    except requests.RequestException as e:
        print(f"Request failed for {url}: {e}")
    except IOError as e:
        print(f"Failed to save image to {path}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def scrape_cosmetics(soup_cosmetics, splashart_dir, champion):
    # Extract all divs with the class 'skin-icon' which contains links to full cosmetic images
    cosmetics_divs = soup_cosmetics.find_all('div', class_="skin-icon")
    print(f"Found {len(cosmetics_divs)} cosmetics divs.")  # Debugging to confirm correct divs are found

    for div in cosmetics_divs:
        a_tag = div.find('a')  # Find the first <a> tag that contains the link to the image
        if a_tag:
            img_tag = a_tag.find('img')  # Find the img tag within the a tag to get the alt attribute
            if img_tag and 'alt' in img_tag.attrs:
                alt_text = img_tag['alt']
                print(f"Original alt text: {alt_text}")  # Debugging to see the original alt text
                # Process the alt text to create a filename
                skin_parts = alt_text.replace('Skin', '').split()  # Remove 'Skin' and split by spaces
                skin_parts = [part for part in skin_parts if part != champion]  # Remove the champion name
                skin_name = ' '.join(skin_parts)  # Join the remaining parts
                new_name = f"{skin_name} {champion}".strip()  # Create the new name
                img_url = a_tag['href']
                if img_url:
                    print(f"Downloading image from {img_url} as {new_name}")
                    download_image(img_url, os.path.join(splashart_dir, f"{new_name}.png"))
                else:
                    print("No valid href found in <a> tag.")
            else:
                print("No img tag or 'alt' attribute found.")
        else:
            print("No <a> tag found.")

# Example usage:
# Assuming `soup_cosmetics` and `splashart_dir` are defined and the 'champion' variable is known
# scrape_cosmetics(soup_cosmetics, splashart_dir, "Akali")
# Load excluded phrases from a JSON file
with open('excluded_phrases.json', 'r') as file:
    excluded_data = json.load(file)
    phrases_to_exclude = excluded_data['excluded_phrases']

# List of champions to scrape
champions = ["Azir", "Nami", "Poppy", "Akali"]

# Initialize the main dictionary to store quotes and positions
quotes_dict = {"quotes": {"champions": {}}}

# Loop through each champion to fetch quotes and positions
for champion in champions:
    # Extend excluded phrases dynamically for each champion
    champion_specific_exclusions = [f"{champion} {phrase}" for phrase in phrases_to_exclude]
    all_exclusions = champion_specific_exclusions + phrases_to_exclude

    # Build the URLs dynamically for each champion
    champion_audio = f"https://leagueoflegends.fandom.com/wiki/{champion}/LoL/Audio"
    champion_lol = f"https://leagueoflegends.fandom.com/wiki/{champion}/LoL"
    champion_universe = f"https://leagueoflegends.fandom.com/wiki/{champion}"
    champion_cosmetics = f"https://leagueoflegends.fandom.com/wiki/{champion}/LoL/Cosmetics"

    # Make GET requests to fetch the pages
    page_audio = requests.get(champion_audio)
    page_lol = requests.get(champion_lol)
    page_universe = requests.get(champion_universe)
    page_cosmetics = requests.get(champion_cosmetics)

    # Create Beautiful Soup objects with the HTML content
    soup_audio = BeautifulSoup(page_audio.content, "html.parser")
    soup_lol = BeautifulSoup(page_lol.content, "html.parser")
    soup_universe = BeautifulSoup(page_universe.content, "html.parser")
    soup_cosmetics = BeautifulSoup(page_cosmetics.content, "html.parser")

    # List of sections to exclude
    exclude_sections = ["Taunt", "Joke", "Laugh", "Sound Effects", "Ability Casting", "Death"]

    quotes = []
    stop_scraping = False
    current_section = ""
    skip_current_section = False  # Flag to skip current section

    # Extract relevant quotes from the HTML
    for element in soup_audio.find_all(['h2', 'i', 'span']):
        if element.name == "span" and "Trivia" in element.text:
            stop_scraping = True
            break

        if stop_scraping:
            continue

        if element.name == "h2" and element.find('span', class_='mw-headline'):
            # Determine the current section from the <h2> text
            current_section = element.find('span', class_='mw-headline').text.strip()
            # Check if this section is in the exclusion list
            skip_current_section = current_section in exclude_sections

        # Only process elements if not skipping the current section
        if not skip_current_section:
            if element.name == "i":
                prev_sibling = element.find_previous_sibling()
                if prev_sibling and prev_sibling.name == "sup":
                    continue

                quote_text = element.text.strip()
                if element.find("small") or element.find("b"):
                    continue

                if not any(phrase in quote_text for phrase in all_exclusions):
                    quotes.append(quote_text)

    # Extract position information from the main champion page
    position_div = soup_lol.find("div", {"data-source": "position"})
    positions = []
    if position_div:
        position_links = position_div.find_all("a")
        positions = [link.get_text(strip=True) for link in position_links if link.get_text(strip=True)]

    # Join positions with commas only if there's more than one position
    position = ", ".join(positions) if positions else "Unknown"

    # Extract the release date and get only the year
    release_div = soup_lol.find("div", {"data-source": "release"})
    release_date = "Unknown"

    if release_div:
        release_date_elem = release_div.find("a")
        if release_date_elem:
            full_release_date = release_date_elem.get_text(strip=True)
            # Extract only the year using regex
            import re

            match = re.search(r"\d{4}", full_release_date)
            if match:
                release_date = match.group(0)

    resource_div = soup_lol.find("div", {"data-source": "resource"})
    resource = resource_div.find("span").get_text(strip=True) if resource_div and resource_div.find(
        "span") else "Unknown"

    range_type_div = soup_lol.find("div", {"data-source": "rangetype"})
    range_type = range_type_div.find("span").get_text(strip=True) if range_type_div and range_type_div.find(
        "span") else "Unknown"

    # Extract region information from the region page
    region = "Unknown"
    # First, find the <h3> tag with specific criteria
    region_div = soup_universe.find("div", {"data-source": "region"})
    if region_div:
        # Use CSS selector to target the first <a> with 'title' within nested <span>s
        a_with_title = region_div.select_one("span span a[title]")
        if a_with_title and a_with_title.has_attr('title'):
            region = a_with_title['title']

    # Find the specific image element with the correct alt attribute
    img = soup_universe.find("img", {"alt": f"{champion}Square"})  # Adjusted to match exact alt attribute
    if img:
        img_url = img.get("data-src") or img.get("src")
        if img_url.startswith("http"):
            img_path = os.path.join(champion_pfp_dir, f"{champion}.png")

            # Download the image if the URL exists
            print(f"Downloading image for {champion} from {img_url}")
            img_response = requests.get(img_url, stream=True)
            if img_response.status_code == 200:
                with open(img_path, 'wb') as out_file:
                    shutil.copyfileobj(img_response.raw, out_file)
            else:
                print(f"Failed to download image for {champion}. Status code: {img_response.status_code}")
            del img_response
        else:
            print(f"Image URL is not a valid HTTP URL: {img_url}")
    else:
        print(f"No image element found for {champion}")

    # Extract difficulty level from the main champion page
    difficulty_div = soup_lol.find("div", {"data-source": "difficulty"})
    difficulty_level = "Unknown"

    if difficulty_div:
        difficulty_img = difficulty_div.find("img", {"alt": lambda alt: alt and "Champion difficulty" in alt})
        if difficulty_img:
            difficulty_alt = difficulty_img["alt"]
            # Extract the number from the alt text using regex
            import re

            match = re.search(r"Champion difficulty (\d+)", difficulty_alt)
            if match:
                difficulty_level = match.group(1)

    # Download image from the figure tag
    figure = soup_lol.find('figure', class_='pi-item pi-image')
    if figure:
        a_tag = figure.find('a')
        if a_tag and 'href' in a_tag.attrs:
            img_url = a_tag['href']
            download_image(img_url, os.path.join(figure_dir, f"{champion}.png"))

    # Download splash-arts
    scrape_cosmetics(soup_cosmetics, splashart_dir, champion)

    # Adding to dictionary
    quotes_dict["quotes"]["champions"][champion] = {
        "quotes": quotes,
        "release": release_date,
        "position": position,
        "resource": resource,
        "rangeType": range_type,
        "region": region,
        "difficulty": difficulty_level,
        "image": f"server/assets/champion-pfp/{champion}.png"
    }

# Save the structured data to a JSON file
src_dir = "src"
if not os.path.exists(src_dir):
    os.makedirs(src_dir)

# Save the structured data to a JSON file in the 'src' directory
server_dir = "server"
if not os.path.exists(server_dir):
    os.makedirs(server_dir)

json_file_path = os.path.join(server_dir, "structured_quotes.json")
with open(json_file_path, "w") as json_file:
    json.dump(quotes_dict, json_file, indent=4)
