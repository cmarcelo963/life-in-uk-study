import json
from copy import deepcopy

DATA_FILE = 'topics_grouped.json'
BATCH_FILE = 'add-missing-notable-people.json'


def insert_groups(topic_obj, new_groups):
    existing_ids = set(g.get('id') for g in topic_obj.get('questionGroups', []))
    added = 0
    for g in new_groups:
        if g.get('id') in existing_ids:
            continue
        topic_obj.setdefault('questionGroups', []).append(g)
        added += 1
    return added


def merge_groups():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        topics = json.load(f)
    with open(BATCH_FILE, 'r', encoding='utf-8') as f:
        batches = json.load(f)

    # Index existing topics by title
    title_index = {}
    for idx, t in enumerate(topics):
        title = t.get('title') or t.get('topic')
        if title:
            title_index[title] = idx

    added_total = 0
    for batch in batches:
        title = batch.get('topicTitle')
        idx = title_index.get(title)
        if idx is None:
            topics.append({
                'title': title,
                'questionGroups': deepcopy(batch.get('questionGroups', []))
            })
            added_total += len(batch.get('questionGroups', []))
        else:
            added_total += insert_groups(topics[idx], batch.get('questionGroups', []))

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=4, ensure_ascii=False)

    print(f"Added {added_total} new question groups for missing notable people.")


if __name__ == '__main__':
    merge_groups()
