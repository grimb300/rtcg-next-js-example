import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>Next.js Meetups</title>
        <meta name="description" content="Browse a list of meetups!" />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// this function is called on each request, builds a static page each time
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an api
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

// this function is called only during the build process to fetch data for static generation
export async function getStaticProps() {
  // fetch data from an api
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => {
        return {
          title: meetup.title,
          address: meetup.address,
          image: meetup.image,
          id: meetup._id.toString(),
        };
      }),
    },
    // Number of seconds between regeneration
    revalidate: 10,
  };
}

export default HomePage;
