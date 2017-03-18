using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestMongoApp
{
    class Program
    {
        static void Main(string[] args)
        {
            GeoSample test = new GeoSample();
            test.Run().Wait();
        }
    }
}
