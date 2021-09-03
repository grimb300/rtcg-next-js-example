import { Fragment } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupPage(props) {
  const router = useRouter();
  const meetupData = props.meetupData;

  return (
    <Fragment>
      <Head>
        <title>{meetupData.title}</title>
        <meta name="description" content={meetupData.description} />
      </Head>
      <MeetupDetail
        title={meetupData.title}
        image={meetupData.image}
        address={meetupData.address}
        description={meetupData.description}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  // fetch all possible params
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    // Will there be dynamically generated pages?
    // fallback === false --- the params returned are all possible pages
    // fallback === true  --- atttempt to dynamically generate a page if not in this list
    fallback: "blocking",
    paths: meetups.map((meetup) => {
      return {
        params: {
          meetupId: meetup._id.toString(),
        },
      };
    }),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  // fetch data for a single meetup
  const client = await MongoClient.connect(process.env.MONGODB_CONNECT);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  client.close();

  return {
    props: {
      meetupData: {
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
      },
    },
  };
}

export default MeetupPage;
