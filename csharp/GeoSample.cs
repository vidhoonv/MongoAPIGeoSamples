using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Authentication;

namespace TestMongoApp
{
    class GeoSample
    {
        private const string DBName = "testdb";
        private const string CollName = "csharpsample";
        private MongoClient client;
        private IMongoDatabase db;
        private IMongoCollection<SampleDocument> coll;

        public GeoSample()
        {
            
        }
        public async Task Run()
        {
            try
            {
                this.client = new MongoClient(this.GetSettingsHelper());
                this.db = this.client.GetDatabase(GeoSample.DBName);
                this.coll = this.db.GetCollection<SampleDocument>(GeoSample.CollName);

                
                await this.PopulateInitialDocs();
                    
                await this.ReadUsingReadPref(ReadPreferenceMode.Primary);
                await this.ReadUsingReadPref(ReadPreferenceMode.Nearest);
                await this.ReadUsingReadPref(ReadPreferenceMode.Secondary);
                    
                await this.ReadFromSpecificRegion("West US");

                await this.Cleanup();

                Console.WriteLine("Run complete");
                Console.ReadLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.GetType());
            }
        }

        private MongoClientSettings GetSettingsHelper()
        {
            const string MongoAuthScramSHATypeString = "SCRAM-SHA-1";
            List<MongoServerAddress> servers = new List<MongoServerAddress>();

            servers.Add(new MongoServerAddress("mongogeotest.documents-bvt.windows-int.net", 10255));
            MongoClientSettings settings = new MongoClientSettings();
            settings.Servers = servers;

            settings.ConnectionMode = ConnectionMode.ReplicaSet;
            settings.ReplicaSetName = "globaldb";

            settings.UseSsl = true;
            settings.VerifySslCertificate = false;
            settings.SslSettings = new SslSettings();
            settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;

            MongoIdentity identity1 = new MongoInternalIdentity(GeoSample.DBName, "mongogeotest ");
            // [SuppressMessage("Microsoft.Security", "CS002:SecretInNextLine")]
            MongoIdentityEvidence evidence = new PasswordEvidence("jU4DlJ1Fwy7qcovsJcNi9CD6CSkdh7bB00Z8Xm8drBaiNnEmuNK8hhrBna90ESIfWK0NiPtStCRzn5iuhm9Vkw==");

            settings.Credentials = new List<MongoCredential>()
            {
                new MongoCredential(MongoAuthScramSHATypeString, identity1, evidence),
            };

            return settings;
        }

        private async Task PopulateInitialDocs()
        {
            for (int i = 0; i < 10; i++)
            {
                await this.coll.InsertOneAsync(SampleDocument.getADoc());
            }

            Console.WriteLine("Insert completed");
        }

        private async Task<int> ReadUsingReadPref(ReadPreferenceMode readPrefMode)
        {
            Console.WriteLine("ReadPrefMode: {0}", readPrefMode.ToString());
            var filter = new BsonDocument();
            int count = 0;
            ReadPreference readpref = new ReadPreference(readPrefMode);
            using (var cursor = await this.coll.WithReadPreference(readpref).FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var doc in batch)
                    {
                        count++;
                        Console.WriteLine(doc);
                    }
                }
            }
            return count;
        }

        private async Task ReadFromSpecificRegion(string regionName)
        {

            Console.WriteLine("Read from region: {0}", regionName);
            var filter = new BsonDocument();
            int count = 0;
            ReadPreference readpref = ReadPreference.Nearest.With(GeoSample.GetRegionTagSets(regionName));
            using (var cursor = await this.coll.WithReadPreference(readpref).FindAsync(filter))
            {
                while (await cursor.MoveNextAsync())
                {
                    var batch = cursor.Current;
                    foreach (var doc in batch)
                    {
                        Console.WriteLine(doc);
                        count++;
                    }
                }
            }
        }

        private static List<TagSet> GetRegionTagSets(string regionName)
        {
            Tag regionTag = new Tag("region", regionName);
            List<Tag> tags = new List<Tag>();
            tags.Add(regionTag);

            TagSet tagset = new TagSet(tags);
            List<TagSet> tagsets = new List<TagSet>();
            tagsets.Add(tagset);

            return tagsets;
        }

        private async Task Cleanup()
        {
            var dbuilder = Builders<SampleDocument>.Filter;
            var delete = dbuilder.Empty;
            var deleteResult = await this.coll.DeleteManyAsync(delete);
        }


        private sealed class SampleDocument
        {
            public BsonObjectId _id { get; set; }
            public string payload { get; set; }

            public override bool Equals(object obj)
            {
                if (obj == null)
                    return false;

                SampleDocument other = obj as SampleDocument;
                if (other == null)
                    return false;

                if (other._id == this._id && other.payload.Equals(this.payload))
                    return true;
                else
                    return false;
            }
            public override int GetHashCode()
            {
                return _id.GetHashCode() ^ payload.GetHashCode();
            }

            public static SampleDocument getADoc()
            {
                SampleDocument sd = new SampleDocument();
                sd.payload = new String(Enumerable.Repeat('X', 10).ToArray());
                return sd;
            }

            public static string getAPayload()
            {
                return new String(Enumerable.Repeat('X', 10).ToArray());
            }

            public override string ToString()
            {
                return string.Format("_id: {0} ; payload: {1}", this._id, this.payload);
            }
        }
    }
}
