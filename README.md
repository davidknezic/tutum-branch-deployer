> **Watch out!** This is still in development.

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

## Adjust

Unless you want to autodeploy a really small app, you'll want to
adjust how your app is deployed, whether it links to databases,
what environment variables it need and so on.

That's what the `service.json` file is for. Take a look at the
`service.sample.json` file to get an idea what's possible.

## Contibute

Feel free to fork this project and extend it. If you think you've
built something others could use too, create a pull request to
get it back into the main project.

## License

The MIT License (MIT).
Copyright (c) 2015 David Knezić.
