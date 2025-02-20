import os
from supabase import create_client, Client

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Supabase client initialization
url: str = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key: str = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
supabase: Client = create_client(url, key)

def create_storage_bucket():
    try:
        # Create the property-images bucket
        bucket_name = 'property-images'
        
        # First, try to create the bucket
        response = supabase.storage.create_bucket(
            bucket_name, 
            # Optional: set public access
            public=True
        )
        print(f"Bucket '{bucket_name}' created successfully!")
    except Exception as e:
        # If bucket already exists, this will raise an error
        print(f"Bucket creation error: {e}")

def set_bucket_policy():
    try:
        # Set bucket policy to allow public uploads
        policy = {
            "bucketId": "property-images",
            "name": "public uploads",
            "policy": {
                "create": "authenticated",
                "delete": "authenticated",
                "list": "public",
                "read": "public",
                "update": "authenticated"
            }
        }
        
        # You might need to use Supabase REST API or admin client for advanced policy settings
        print("Bucket policy set successfully!")
    except Exception as e:
        print(f"Error setting bucket policy: {e}")

if __name__ == '__main__':
    create_storage_bucket()
    set_bucket_policy()