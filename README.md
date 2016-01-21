<img src="https://files.slack.com/files-pri/T08J724LX-F0K1N6LM6/slack_for_ios_upload.png?pub_secret=d75104f8aa" width="300" alt="Tutum Autodeploy" />

# Tutum Autodeploy

You open a pull request for your next unicorn app. This tool automatically
deploys it to Tutum, the Docker platform and posts the URL to the
pull request on GitHub.

You delete your branch and the deployed app will be terminated.
*Just like that.*

## Install

1. [Fork this project](https://github.com/davidknezic/tutum-tagger#fork-destination-box)
2. If necessary, adjust the `service.json` file
3. [Deploy to Tutum](https://dashboard.tutum.co/stack/deploy/)

## Configure

In order for this app to work properly, it needs to
get notified on the `push` and `remove` events from GitHub. This is
why you need to create an event hook for your repository and
set this environment variable:

```sh
GITHUB_WEBHOOK_SECRET=your_github_webhook_secret
```

You additionally need to provide access to the `repo:status` scopes,
so the app can write new statuses to your repository. Create a new
personal access token on GitHub for that and add the following:

```sh
GITHUB_USERNAME=your_github_username
GITHUB_APIKEY=your_github_apikey
```

Finally, you need to grant access to the Tutum api in order for
the app to create new services. Get a new api key, set it as an
environment variable together with the name of the image that
should be used:


```sh
TUTUM_USERNAME=your_tutum_username
TUTUM_APIKEY=your_tutum_apikey
TUTUM_IMAGE=your_tutum_image_name
```

## Adjust

Unless you want to autodeploy a really small app, you'll want to
adjust how your app is deployed, whether it links to databases,
what environment variables it need and so on.

That's what the `service.json` file is for. Take a look at the
`service.sample.json` file to get an idea what's possible.

## Contribute

Feel free to fork this project and extend it. If you think you've
built something others could use too, create a pull request to
get it back into the main project.

## Test

To run the tests, use the following command:

```sh
npm test
```

## License

The MIT License (MIT).
Copyright (c) 2015 David Knezić.
