(function (root, cls) {
   if (typeof define === 'function' && define.amd) {
      define(cls);
   } else {
      root.Observer = cls();
   }
}(this, function() {
   /**
    * Pub/Sub library that allows 'subscribe', 'publish' and 'unsubscribe' methods.
    *
    * @constructor
    * @name Observer
    */
   function Observer() {
      if (!(this instanceof Observer)) {
         return new Observer();
      }
   }

   /**
    * @type {Object}
    */
   Observer.prototype._topics = null;

   /**
    * @type {Boolean}
    */
   Observer.prototype._eventsShouldBubble = false;

   /**
    * Static method to get all possible events that can bubble from a given eventName.
    * @param {String} eventName - eventName to split on ':' and return all possible events to bubble.
    * @return {String[]}
    */
   Observer.getBubbleEvents = function(eventName) {
      return eventName.split(':').map(function(splitName, index, eventArr) {
         return eventArr.slice(0, index + 1).join(':');
      });
   };

   /**
    * Whether events should events bubble up to parent.
    * @return {*} 'this' for chaining
    */
   Observer.prototype.withEventBubbling = function() {
      this._eventsShouldBubble = true;
      return this;
   };

   /**
    * Lazy getter for topics.
    * @return {Object}
    */
   Observer.prototype._getTopics = function() {
      if (!this._topics) {
         this._topics = Object.create(null);
      }
      return this._topics;
   };

   /**
    * Private method to publish an event.
    * @param {String} eventName - event to publish.
    * @param {Boolean} [bubble] - whether event should bubble or not. True by default.
    * @return {Boolean} - false if a handler has returned false, this will prevent the vent 'bubbling'.
    */
   Observer.prototype._publish = function(eventName, bubble) {
      var observers = this._getTopics()[eventName],
         args = Array.prototype.slice.call(arguments, 1),
         returnedValue,
         observersClone;

      if (observers) {
         observersClone = observers.slice();
         for (var i = 0, l = observersClone.length; i < l; i++) {
            returnedValue = observersClone[i].handler.apply(observersClone[i].scope || this, args);
            if (observersClone[i].once) {
               observers.splice(i, 1);
            }
            if (returnedValue === false) {
               return false;
            }
         }
      }

      return this._eventsShouldBubble;
   };

   /**
    * Public method to subscribe to a given eventName.
    * @param {String|Object} eventName - event to subscribe to, can be joined via ':'.
    * @param {Function} handler - function to invoke when event is published.
    * @param {Boolean} once - whether handler should only be triggered once and then unsubscribe.
    * @return {*} 'this' for chaining.
    */
   Observer.prototype.subscribe = function(eventName, handler, scope, once) {
      if (eventName && typeof eventName.toString === 'function') {
         eventName = eventName.toString();
      }
      if (typeof handler !== 'function') {
         throw new Error('Observer.subscribe: please provide a function as he handler argument.');
      }
      var topics = this._getTopics();

      if (!topics[eventName]) {
         topics[eventName] = [];
      }

      topics[eventName].push({
         handler: handler,
         scope: scope,
         once: !!once
      });

      return this;
   };

   /**
    * Public method to unsubscribe to a given eventName or scope or everything.
    * @param {String|Object} [eventName] - optional eventName to unsubscribe from.
    * @param {Object} [scope] optional scope to unsubscribe from.
    * @return {*} 'this' for chaining.
    */
   Observer.prototype.unsubscribe = function(eventName, scope) {
      eventName = (eventName && typeof eventName.toString === 'function') ?
         eventName.toString() : eventName;
      var topics = this._getTopics();
      [].concat(eventName || Object.keys(topics)).forEach(function(matchedEvent) {
         var topic = topics[matchedEvent];
         if (topic) {
            topics[matchedEvent] = topic.filter(function(observer) {
               if (scope && observer.scope !== scope) {
                  return observer;
               }
            });

            if (!topics[matchedEvent].length) {
               delete topics[matchedEvent];
            }
         }
      }, this);

      return this;
   };

   /**
    * Public method to publish to a given eventName. Any arguments supplied will be proxied to the handler.
    * the eventName can be joined via ':' and all events will be called unless a handler returns false then bubbling will be prevented.
    * @param {String|Object} eventName - eventName to publish.
    * @return {*} 'this' for chaining.
    */
   Observer.prototype.publish = function(eventName) {
      if (eventName && typeof eventName.toString === 'function') {
         eventName = eventName.toString();
      } else {
         return this;
      }

      var eventsToPublish = Observer.getBubbleEvents(eventName),
         args = Array.prototype.slice.call(arguments, 1),
         eventArgs;

      while (eventsToPublish.length) {
         eventArgs = args.slice();
         eventArgs.unshift(eventsToPublish[eventsToPublish.length - 1]);
         if (this._publish.apply(this, eventArgs) === false) {
            break;
         }
         eventsToPublish.pop();
      }

      return this;
   };

   return Observer;
}));
