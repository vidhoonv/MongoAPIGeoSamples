package mongogeotest;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.ReadPreference;
import com.mongodb.Tag;
import com.mongodb.TagSet;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;


public class GeoSample {
	
   public static void main(String[] args)
   {
	   try 
	   {	   
		   
		   MongoClientURI uri = new MongoClientURI("mongodb://<username>:<password>@<DocDBAccountEndpoint>:<port>/<dbname>?ssl=true&replicaSet=globaldb");
		   MongoClient mongoClient = new MongoClient(uri);
		   
		   MongoDatabase database = mongoClient.getDatabase("<dbname>");
		   
		   //Example of inserting docs (goes to write region)
		   MongoCollection<Document> collection = database.getCollection("<collname>");
		   List<Document> docs = new ArrayList<Document>();
		   docs.add(new Document("fruit", "apple"));
		   docs.add(new Document("fruit", "orange"));
		   docs.add(new Document("fruit", "mango"));
		   collection.insertMany(docs);
		   
		   //Example of reading from Write region (readpreference = primary)
		   MongoCollection<Document> writeRegionCollection = database.getCollection("<collname>").withReadPreference(ReadPreference.primary());
		   List<Document> foundDocument = writeRegionCollection.find().into(new ArrayList<Document>());
		   System.out.println("Documents from write region:");
		   for(Iterator<Document> idoc = foundDocument.iterator(); idoc.hasNext();)
		   {
			    Document item = idoc.next();
			    System.out.println(item);
		   }
		   
		   //Example of reading from Nearest region (readpreference = nearest)
		   MongoCollection<Document> nearestRegionCollection = database.getCollection("<collname>").withReadPreference(ReadPreference.nearest());
		   foundDocument = nearestRegionCollection.find().into(new ArrayList<Document>());
		   System.out.println("Documents from nearest region:");
		   for(Iterator<Document> idoc = foundDocument.iterator(); idoc.hasNext();)
		   {
			    Document item = idoc.next();
			    System.out.println(item);
		   }	   

		   
		   //Example of reading from Read region (readpreference = secondary)
		   MongoCollection<Document> readRegionCollection = database.getCollection("<collname>").withReadPreference(ReadPreference.secondary());
		   foundDocument = readRegionCollection.find().into(new ArrayList<Document>());
		   System.out.println("Documents from read region:");
		   for(Iterator<Document> idoc = foundDocument.iterator(); idoc.hasNext();)
		   {
			    Document item = idoc.next();
			    System.out.println(item);
		   }
		   
		   //Example of reading from a specific region using tags
		   //you specify your read region here as a Tag.
		   //pick region name based on your DocumentDB region from:
		   //https://azure.microsoft.com/en-us/regions/
		   //or use portal for region names
		   Tag tag = new Tag("region", "<regionName>"); 
		   TagSet tagset = new TagSet(tag);
		   List<TagSet> tagsetList = new ArrayList<TagSet>();
		   tagsetList.add(tagset);
		   
		   ReadPreference regionPref = ReadPreference.nearest(tagsetList);
		   MongoCollection<Document> specificRegionCollection = database.getCollection("<collname>").withReadPreference(regionPref);
		   foundDocument = specificRegionCollection.find().into(new ArrayList<Document>());
		   System.out.println("Documents from specific region :");
		   for(Iterator<Document> idoc = foundDocument.iterator(); idoc.hasNext();)
		   {
			    Document item = idoc.next();
			    System.out.println(item);
		   }
		   
		   
		   System.out.println("Sample complete");
		   
	   } 
	   catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
   }
}
