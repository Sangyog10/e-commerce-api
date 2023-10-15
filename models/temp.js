//FOR CALCULATING AVERAGE RATING
//it is the code snippet taken from mongodb database by going into  reviews/aggregation

//first step:stage 1($match)-->
// {
//   "product":ObjectId('652ac47d61229d63855ea003') //enter the product id of the reviews you want to sort
// }

//stage 2($group)
//   {
//     _id: null,
//    averageRating:{$avg:"$rating"},
//    noOfReviews:{$sum:1}
//   } //it will calculate the required things and then import the code

import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const agg = [
  {
    $match: {
      product: new ObjectId("652ac47d61229d63855ea003"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      noOfReviews: {
        $sum: 1,
      },
    },
  },
];

const client = await MongoClient.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const coll = client.db("Ecommerce").collection("reviews");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
