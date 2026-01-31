#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sermon Finder - Find which sermon to display for a given date
"""
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

def load_json(filename):
    """Load JSON file"""
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_pascha_date(year):
    """Get Pascha date for a given year from liturgical calendar"""
    try:
        calendar = load_json(f'liturgical-calendar-{year}.json')
        return datetime.strptime(calendar['pascha'], '%Y-%m-%d').date()
    except FileNotFoundError:
        print(f"Warning: Calendar for {year} not found")
        return None

def find_sermon_for_date(target_date_str):
    """
    Find the sermon that should be displayed for a given date

    Args:
        target_date_str: Date string in format 'YYYY-MM-DD' or 'DD.MM.YYYY'

    Returns:
        dict: Sermon details or None if not found
    """
    # Parse input date (support multiple formats)
    try:
        if '.' in target_date_str:
            target_date = datetime.strptime(target_date_str, '%d.%m.%Y').date()
        else:
            target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()
    except ValueError as e:
        print(f"Error parsing date: {e}")
        print("Please use format: YYYY-MM-DD or DD.MM.YYYY")
        return None

    year = target_date.year

    # Get Pascha date for this year
    pascha_date = get_pascha_date(year)
    if not pascha_date:
        print(f"Cannot find Pascha date for year {year}")
        return None

    print(f"\n{'='*60}")
    print(f"Target Date: {target_date.strftime('%A, %B %d, %Y')}")
    print(f"Pascha {year}: {pascha_date.strftime('%A, %B %d, %Y')}")
    print(f"Days from Pascha: {(target_date - pascha_date).days}")
    print(f"{'='*60}\n")

    # Load complete sermon library
    library = load_json('complete-sermon-library.json')

    # Find matching sermon
    best_match = None
    best_match_distance = float('inf')

    # Search through liturgical sermons
    if 'categories' in library and 'liturgical' in library['categories']:
        for sermon in library['categories']['liturgical']['sermons']:
            sermon_date = None

            # Calculate sermon date based on type
            if sermon.get('type') == 'pascha-offset' and sermon.get('paschaOffset') is not None:
                offset = sermon['paschaOffset']
                sermon_date = pascha_date + timedelta(days=offset)
            elif sermon.get('type') == 'fixed-feast' and sermon.get('date'):
                sermon_date = datetime.strptime(sermon['date'], '%Y-%m-%d').date()

            if sermon_date:
                distance = abs((target_date - sermon_date).days)

                # Exact match
                if distance == 0:
                    return sermon

                # Track closest match (within 7 days)
                if distance < best_match_distance and distance <= 7:
                    best_match_distance = distance
                    best_match = sermon

    return best_match

def print_sermon_details(sermon):
    """Print sermon details in a formatted way"""
    if not sermon:
        print("No sermon found for this date")
        return

    print("SERMON FOUND:")
    print(f"\n{'-'*60}")
    print(f"Title: {sermon.get('title', 'N/A')}")
    print(f"Date: {sermon.get('date', 'N/A')}")

    if sermon.get('paschaOffset') is not None:
        offset = sermon['paschaOffset']
        if offset == 0:
            print(f"Pascha Offset: {offset} (Pascha itself)")
        elif offset > 0:
            print(f"Pascha Offset: +{offset} days after Pascha")
        else:
            print(f"Pascha Offset: {offset} days before Pascha")

    print(f"Category: {sermon.get('category', 'N/A')}")
    print(f"Subcategory: {sermon.get('subcategory', 'N/A')}")
    print(f"Gospel: {sermon.get('gospelReading', 'N/A')}")
    print(f"Duration: {sermon.get('duration', 'Unknown')}")
    print(f"Recorded: {sermon.get('recordingYear', 'Unknown')}")
    print(f"Audio: {sermon.get('audioFile', 'N/A')}")

    if sermon.get('description'):
        print(f"\nDescription: {sermon['description']}")

    print(f"{'-'*60}\n")

def main():
    """Main function"""
    print("\nSERMON FINDER - Find the sermon for any date\n")

    # Get date from user
    date_input = input("Enter date (DD.MM.YYYY or YYYY-MM-DD): ").strip()

    if not date_input:
        print("No date provided. Using test date: 19.04.2026")
        date_input = "19.04.2026"

    # Find sermon
    sermon = find_sermon_for_date(date_input)

    # Print results
    print_sermon_details(sermon)

if __name__ == "__main__":
    main()
