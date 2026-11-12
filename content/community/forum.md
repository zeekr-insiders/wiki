---
seo_title: "Zeekr Insiders forum"
description: "The Zeekr Insiders owners' forum: what it is for, how it fits with the wiki and the club's other channels, and where to ask questions about owning a Zeekr."
changelog: "The forum is live: how to join and where to start"
---
# Forum

The {{ extra.club.full_name }} forum is live, and it is the club's home: **[{{ extra.club.forum_url }}]({{ extra.club.forum_url }})**.

Create an account, introduce yourself, and if you have just taken delivery, post in the deliveries thread.

## What the forum is for

- **Questions and answers**: "Is this normal?" "Anyone else getting this issue?" "What tyres are you running?"
- **Discussions**: charging strategies, road trip stories, comparing configurations
- **Sharing experiences**: first impressions, long-term ownership updates, service experiences
- **Regional chat**: state-specific discussions about charging networks, dealers and local events
- **Technical deep-dives**: OTA updates, battery management and diagnostic codes, for those who want the detail

### What the wiki is for

This wiki is for **reference material**: guides, specifications, how-tos and documented knowledge. Think of it as the manual.

The forum is for **conversations**: everything else.

## Why a forum?

Facebook groups work well for quick discussions and event coordination, but they are not great for:

- **Searchability**: try finding that one post from six months ago about tyre recommendations
- **Organisation**: threads get buried, topics drift, knowledge gets lost
- **Permanence**: Facebook owns your content and can change the rules anytime
- **Privacy**: not everyone wants to be on Facebook

The forum gives us:

- Proper categories and tags
- Search that actually works
- A permanent archive of knowledge
- No algorithmic timeline
- Control over our own data

## Does it replace the Facebook groups?

No. The club's Facebook groups are still there for casual chat, event coordination and reaching people quickly: {% for g in extra.club.facebook_groups %}[{{ g.name }}]({{ g.url }}){{ ", " if not loop.last else "." }}{% endfor %} The forum is where deeper discussions live and where answers stay findable. Use whichever suits your question.

## How to get started

1. **Create an account**: simple registration, no Facebook required
2. **Introduce yourself**: say hello and tell us what you drive
3. **Start posting**: ask questions, share what you know, join discussions

Early members shape what the forum becomes, so if you have opinions about how it should work, post them there.

## Contributing to the wiki vs the forum

**Post in the forum** when you:

- Have a question
- Want to discuss something
- Need help with a specific issue
- Want to share an experience

**Contribute to the wiki** when you:

- Have documented a process others might need
- Want to add specifications or reference data
- Have written a guide or how-to
- Found an error in existing documentation

The best content often starts as a forum discussion and gets refined into a wiki article.

## Forum link

**{{ extra.club.forum_url if extra.club.forum_url else extra.club.website }}**

Follow the club on [Instagram](https://www.instagram.com/zeekrinsiders/) too.

## Questions about the forum?

Use [the contact form]({{ extra.club.contact_url }}) or ask on the forum itself.

---

*The forum is run by {{ extra.club.abbreviation }} volunteers. If you have experience running forums or want to help moderate, we would love to hear from you.*
