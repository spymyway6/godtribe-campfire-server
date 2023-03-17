export const getBase = async (req, res, next) => {
  try {
    const baseData = {
      namespace: "api",
      routes: {
        '/api/campfires': {
          methods: [
            'GET',
            'POST',
          ],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
            {
              method: 'POST',
              args: {
                topic: {
                  type: 'string',
                  required: true,
                  unique: true,
                },
                altTopic: {
                  type: 'string',
                  required: true,
                },
                duration: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                  required: true,
                },
                creator: {
                  type: {
                    uid: {
                      type: 'string',
                      required: true,
                    },
                    profileUrl: {
                      type: 'string',
                      required: true,
                    },
                    name: {
                      type: 'string',
                      required: true,
                    },
                  },
                  required: true,
                },
                hidden: Boolean,
                scheduleToStart: {
                  type: Date,
                  default: new Date(),
                },
                openTo: {
                  type: 'string',
                  default: 'Everyone',
                },
              },
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires',
        },
        '/api/campfires/owned?cid=:cid': {
          methods: ['GET'],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/owned?cid=:cid',
        },
        '/api/campfires/public?cid=:cid': {
          methods: ['GET'],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/public?cid=:cid',
        },
        '/api/campfires/private?cid=:cid': {
          methods: ['GET'],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/private?cid=:cid',
        },
        '/api/campfires/owned?cid=:cid&tpc=:topic': {
          methods: ['GET'],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/owned?cid=:cid&tpc=:topic',
        },
        '/api/campfires/public?cid=:cid&tpc=:topic': {
          methods: ['GET'],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/public?cid=:cid&tpc=:topic',
        },
        '/api/campfires/private?cid=:cid&tpc=:topic': {
          methods: ['GET'],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/private?cid=:cid&tpc=:topic',
        },
        '/api/campfires/:id': {
          methods: [
            'GET',
            'PATCH',
            'DELETE',
          ],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
            {
              method: 'PATCH',
              args: {
                topic: {
                  type: 'string',
                  required: true,
                  unique: true,
                },
                altTopic: {
                  type: 'string',
                  required: true,
                },
                duration: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                  required: true,
                },
                hidden: Boolean,
                scheduleToStart: {
                  type: Date,
                  default: new Date(),
                },
                openTo: {
                  type: 'string',
                  default: 'Everyone',
                  options: 'Everyone' | 'Invite Only'
                },
              },
            },
            {
              method: 'DELETE',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/:id',
        },
        '/api/campfires/:id/member': {
          methods: [
            'GET',
          ],
          endpoints: [
            {
              method: 'GET',
              args: {},
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/campfires/:id/member',
        },
        '/api/member/get': {
          methods: [
            'POST',
          ],
          endpoints: [
            {
              method: 'POST',
              args: {
                id: {
                  type: 'string',
                  required: true,
                  ref: 'Campfire',
                },
                uid: {
                  type: 'string',
                  required: true,
                },
              },
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/member/get',
        },
        '/api/member/push': {
          methods: [
            'PATCH',
          ],
          endpoints: [
            {
              method: 'PATCH',
              args: {
                id: {
                  type: 'string',
                  required: true,
                  ref: 'Campfire',
                },
                member: {
                  type: {
                    profileUrl: 'string',
                    name: 'string',
                    campfire: 'string',
                    uid: 'string',
                  },
                  required: true
                },
              },
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/member/push',
        },
        '/api/member/pull': {
          methods: [
            'PATCH',
          ],
          endpoints: [
            {
              method: 'PATCH',
              args: {
                id: {
                  type: 'string',
                  required: true,
                  ref: 'Campfire',
                },
                uid: {
                  type: 'string',
                  required: true,
                },
              },
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/member/pull',
        },
        '/api/member/set/status': {
          methods: [
            'PATCH',
          ],
          endpoints: [
            {
              method: 'PATCH',
              args: {
                status: {
                  type: 'string',
                  required: true,
                  options: 'pending' | 'invited',
                },
                id: {
                  type: 'string',
                  required: true,
                  ref: 'Campfire',
                },
                uid: {
                  type: 'string',
                  required: true,
                },
              },
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/member/set/status',
        },
        '/api/member/set/role': {
          methods: [
            'PATCH',
          ],
          endpoints: [
            {
              method: 'PATCH',
              args: {
                role: {
                  type: 'string',
                  required: true,
                  options: 'speaker' | 'moderator' | 'audience',
                },
                id: {
                  type: 'string',
                  required: true,
                  ref: 'Campfire',
                },
                uid: {
                  type: 'string',
                  required: true,
                },
              },
            },
          ],
          link: 'https://staging-campfire-api.azurewebsites.net/api/member/set/role',
        },
      },
    };

    res.status(200).json(baseData);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};