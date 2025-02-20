import os
from supabase import create_client, Client

# Load environment variables (optional, but recommended)
from dotenv import load_dotenv
load_dotenv()

# Supabase client initialization
url: str = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key: str = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(url, key)

# Your properties data (replace with the actual import method)
real_properties = [
    {
        "id": 1,
        "title": "Luxury Spindrift Estate",
        "address": "1900 Spindrift Dr, La Jolla, CA 92037",
        "broker": "COMPASS",
        "price": "108,000,000",
        "beds": "10",
        "baths": "17",
        "sqft": "12,981",
        "url": "https://www.zillow.com/homedetails/1900-Spindrift-Dr-La-Jolla-CA-92037/16839110_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 2,
        "address": "801 La Jolla Rancho Rd, La Jolla, CA 92037",
        "broker": "BERKSHIRE HATHAWAY HOMESERVICES CALIFORNIA PROPERTIES",
        "price": "3,995,000",
        "beds": "3",
        "baths": "3",
        "sqft": "2,890",
        "url": "https://www.zillow.com/homedetails/801-La-Jolla-Rancho-Rd-La-Jolla-CA-92037/16855358_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 3,
        "address": "6283 La Jolla Scenic Dr S, La Jolla, CA 92037",
        "broker": "EXP REALTY OF CALIFORNIA, INC.",
        "price": "22,500,000",
        "beds": "7",
        "baths": "10",
        "sqft": "12,842",
        "url": "https://www.zillow.com/homedetails/6283-La-Jolla-Scenic-Dr-S-La-Jolla-CA-92037/16852003_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 4,
        "address": "6653 Neptune Pl, La Jolla, CA 92037",
        "broker": "PACASO INC.",
        "price": "1,300,000",
        "beds": "4",
        "baths": "5",
        "sqft": "3,124",
        "url": "https://www.zillow.com/homedetails/6653-Neptune-Pl-La-Jolla-CA-92037/16850262_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 5,
        "address": "5740 La Jolla Corona Dr, La Jolla, CA 92037",
        "broker": "PACIFIC SOTHEBY'S INT'L REALTY",
        "price": "14,750,000",
        "beds": "6",
        "baths": "8",
        "sqft": "8,810",
        "url": "https://www.zillow.com/homedetails/5740-La-Jolla-Corona-Dr-La-Jolla-CA-92037/16856415_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 6,
        "address": "7253 Monte Vista Ave, La Jolla, CA 92037",
        "broker": "COLDWELL BANKER REALTY",
        "price": "8,250,000",
        "beds": "4",
        "baths": "5",
        "sqft": "3,577",
        "url": "https://www.zillow.com/homedetails/7253-Monte-Vista-Ave-La-Jolla-CA-92037/16849344_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 7,
        "address": "5633 Soledad Mountain Rd, La Jolla, CA 92037",
        "broker": "BIG BLOCK REALTY, INC.",
        "price": "2,795,000",
        "beds": "4",
        "baths": "3",
        "sqft": "2,638",
        "url": "https://www.zillow.com/homedetails/5633-Soledad-Mountain-Rd-La-Jolla-CA-92037/16857069_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 8,
        "address": "7134 Olivetas Ave, La Jolla, CA 92037",
        "broker": "HEARTLAND REAL ESTATE",
        "price": "2,390,000",
        "beds": "2",
        "baths": "2",
        "sqft": "1,426",
        "url": "https://www.zillow.com/homedetails/7134-Olivetas-Ave-La-Jolla-CA-92037/16849457_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 9,
        "address": "6308 Camino De La Costa, La Jolla, CA 92037",
        "broker": "DOUGLAS ELLIMAN OF CALIFORNIA, INC.",
        "price": "35,000,000",
        "beds": "9",
        "baths": "10",
        "sqft": "10,260",
        "url": "https://www.zillow.com/homedetails/6308-Camino-De-La-Costa-La-Jolla-CA-92037/16850611_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 10,
        "address": "7135 Olivetas Ave, La Jolla, CA 92037",
        "broker": "BERKSHIRE HATHAWAY HOMESERVICES CALIFORNIA PROPERTIES",
        "price": "4,498,000",
        "beds": "5",
        "baths": "3",
        "sqft": "2,231",
        "url": "https://www.zillow.com/homedetails/7135-Olivetas-Ave-La-Jolla-CA-92037/16849471_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 11,
        "address": "2310 Calle De La Garza, La Jolla, CA 92037",
        "broker": "EXP REALTY OF CALIFORNIA, INC.",
        "price": "9,500,000",
        "beds": "5",
        "baths": "8",
        "sqft": "5,250",
        "url": "https://www.zillow.com/homedetails/2310-Calle-De-La-Garza-La-Jolla-CA-92037/16838630_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 12,
        "address": "5632 Ladybird Ln, La Jolla, CA 92037",
        "broker": "PACIFIC SOTHEBY'S INT'L REALTY",
        "price": "2,700,000",
        "beds": "3",
        "baths": "2",
        "sqft": "2,249",
        "url": "https://www.zillow.com/homedetails/5632-Ladybird-Ln-La-Jolla-CA-92037/16855842_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 13,
        "address": "2916 Murat St, San Diego, CA 92117",
        "broker": "KELLER WILLIAMS LA JOLLA",
        "price": "1,375,000",
        "beds": "3",
        "baths": "2",
        "sqft": "1,596",
        "url": "https://www.zillow.com/homedetails/2916-Murat-St-San-Diego-CA-92117/16860273_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 14,
        "address": "3890 Nobel Dr UNIT 208, San Diego, CA 92122",
        "broker": "PACIFIC REGENT REALTY",
        "price": "375,000",
        "beds": "2",
        "baths": "2",
        "sqft": "1,226",
        "url": "https://www.zillow.com/homedetails/3890-Nobel-Dr-UNIT-208-San-Diego-CA-92122/16837211_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 15,
        "address": "2223 Via Media, La Jolla, CA 92037",
        "broker": "BERKSHIRE HATHAWAY HOMESERVICES CALIFORNIA PROPERTIES",
        "price": "7,670,000",
        "beds": "6",
        "baths": "7",
        "sqft": "4,824",
        "url": "https://www.zillow.com/homedetails/2223-Via-Media-La-Jolla-CA-92037/16857678_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 16,
        "address": "6350 Genesee Ave UNIT 107, San Diego, CA 92122",
        "broker": "THE AGENCY",
        "price": "360,000",
        "beds": "1",
        "baths": "1",
        "sqft": "578",
        "url": "https://www.zillow.com/homedetails/6350-Genesee-Ave-UNIT-107-San-Diego-CA-92122/16843499_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 17,
        "address": "5723 Scripps St, San Diego, CA 92122",
        "broker": "REALTY ONE GROUP PACIFIC",
        "price": "1,445,000",
        "beds": "4",
        "baths": "2",
        "sqft": "1,500",
        "url": "https://www.zillow.com/homedetails/5723-Scripps-St-San-Diego-CA-92122/17191526_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 18,
        "address": "9773 Keeneland Row, La Jolla, CA 92037",
        "broker": "COMPASS",
        "price": "1,398,000",
        "beds": "2",
        "baths": "3",
        "sqft": "2,174",
        "url": "https://www.zillow.com/homedetails/9773-Keeneland-Row-La-Jolla-CA-92037/17204089_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    },
    {
        "id": 19,
        "address": "5366 Calumet Ave, La Jolla, CA 92037",
        "broker": "BERKSHIRE HATHAWAY HOMESERVICE",
        "price": "9,988,000",
        "beds": "4",
        "baths": "5",
        "sqft": "3,999",
        "url": "https://www.zillow.com/homedetails/5366-Calumet-Ave-La-Jolla-CA-92037/16907441_zpid/",
        "available": True,
        "reviews": [{
            "id": "review-1",
            "author": "Alice Smith",
            "rating": 4,
            "comment": "Great property, nice location!",
            "date": "2024-02-06T10:30:00Z"
        }]
    }
]

def insert_properties():
    try:
        # Prepare properties for insertion (remove reviews)
        # properties_to_insert = [{k: v for k, v in prop.items() if k != 'reviews'} for prop in real_properties]
        properties_to_insert = [{k: v for k, v in prop.items() if k != 'id' and k != 'reviews'} for prop in real_properties]
        
        # Insert properties
        property_response = supabase.table('properties').upsert(properties_to_insert).execute()
        
        # Prepare reviews with property IDs
        reviews_to_insert = []
        for prop in real_properties:
            property_id = prop['id']
            for review in prop['reviews']:
                review_data = review.copy()
                review_data['property_id'] = property_id
                reviews_to_insert.append(review_data)
        
        # Insert reviews
        review_response = supabase.table('reviews').upsert(reviews_to_insert).execute()
        
        print("Properties inserted successfully:")
        print(f"Properties: {len(property_response.data)}")
        print(f"Reviews: {len(review_response.data)}")
    
    except Exception as e:
        print(f"An error occurred: {e}")

# Run the insertion
if __name__ == '__main__':
    insert_properties()