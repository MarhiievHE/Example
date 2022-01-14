({
  startTask() {
    console.count('schudule')
    application.scheduler.add({
      name: 'Error Demo',
      every: '1m',
      run: 'lib.task1.myTask.testTask2',
    });
  },

  async testTask() {
    console.info('test');
    return 'test';
  },

   async testTask2() {
    const worker = application.worker.id;
    console.info("test");
    console.info(worker);
    throw new Error(`My actual worker id is: ${worker}`);
  }
});